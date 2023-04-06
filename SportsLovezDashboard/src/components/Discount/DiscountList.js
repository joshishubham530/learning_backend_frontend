import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  RefreshControl,
  View,
} from 'react-native';
import {CFetch} from '../../settings/APIFetch';
import {UserContext} from '../../settings/Context';
import DiscountItem from './DiscountItem';
import FlatlistFooter from '../../utilities/FlatListFooter';
import Message from '../../utilities/Message';
import {Button} from 'react-native-paper';
import Colors from '../../settings/Colors';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import PreLoader, {WaitModal} from '../../utilities/PreLoader';

const {height, width} = Dimensions.get('window');
const DiscountList = () => {
  const navigation = useNavigation();
  const {token} = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [waiting, setWaiting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const [data, setData] = useState([]);
  const takeCount = 10;
  const [skip, setSkip] = useState(takeCount);
  const refresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  });
  const loadData = isSkip => {
    CFetch('/Management/Discounts', token, {
      skip: isSkip ? skip : 0,
      take: takeCount,
    })
      .then(res => {
        if (res.status === 200) {
          res.json().then(result => {
            if (result.discounts.length > 0) {
              if (isSkip) {
                setData([...data, ...result.discounts]);
                setSkip(skip + takeCount);
              } else {
                setData(result.discounts);
                setSkip(takeCount);
                setAllLoaded(false);
              }
            } else {
              setAllLoaded(true);
            }
          });
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
        // setWaiting(false);
        setRefreshing(false);
      });
  };
  useEffect(() => {
    loadData();
  }, []);
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );
  const handleEnableDisable = id => {
    setWaiting(true);
    CFetch('/Management/EnableDisableDiscount?id=' + id, token, {})
      .then(res => {
        if (res.status === 200) {
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        loadData();
        setTimeout(() => {
          setWaiting(false);
        }, 1000);
      });
  };
  if (loading) {
    return <PreLoader />;
  }
  return (
    <View style={styles.container}>
      <WaitModal modalVisible={waiting || refreshing} />
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        data={data}
        style={{height: '100%'}}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{padding: 10, flexGrow: 1}}
        ListHeaderComponent={() => (
          <Button
            color={Colors.black}
            style={styles.btn}
            labelStyle={styles.btnLabel}
            onPress={() => navigation.navigate('AddUpdateDiscount')}>
            Add New Offer
          </Button>
        )}
        renderItem={({item, index}) => (
          <DiscountItem
            item={item}
            index={index}
            handleEnableDisable={handleEnableDisable}
          />
        )}
        ListEmptyComponent={() => (
          <Message height={height + 150 - height / 2} message="No Offers" />
        )}
        ListFooterComponent={() =>
          data.length > 0 && (
            <View style={{marginTop: 10}}>
              <FlatlistFooter isAllLoaded={allLoaded} />
            </View>
          )
        }
        onEndReached={() => loadData(true)}
        onEndReachedThreshold={0.2}
      />
    </View>
  );
};

export default DiscountList;

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.blue,
  },
  btnLabel: {
    color: 'white',
  },
});
