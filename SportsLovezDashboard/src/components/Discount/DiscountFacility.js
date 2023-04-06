import React, { useContext, useEffect, useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View, RefreshControl } from 'react-native';
import { CFetch } from '../../settings/APIFetch';
import { UserContext } from '../../settings/Context';
import { Checkbox } from 'react-native-paper';
import Toast from 'react-native-simple-toast';
import PreLoader, { WaitModal } from '../../utilities/PreLoader';
import Colors from '../../settings/Colors';
import Message from '../../utilities/Message';
const DiscountFacility = ({ route, id, handleFacilityCheckBox, addNew, discountFacility }) => {
  const { token } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [waiting, setWaiting] = useState(false);
  const [isAllLoaded, setIsAllLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [facilities, setFacilities] = useState([]);
  const [references, setReferences] = useState([]);
  const takeCount = 15;
  const [skip, setSkip] = useState(takeCount);
  const refresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  });
  const loadData = isSkip => {
    CFetch('/Management/CheckDiscountCouponFacilityReference', token, {
      Id: route != undefined ? route.params.id : id,
      skip: isSkip ? skip : 0,
      take: takeCount,
    })
      .then(res => {
        if (res.status === 200) {
          res.json().then(result => {
            if (result.facilities.length > 0) {
              if (isSkip) {
                setFacilities([...facilities, ...result.facilities]);
                setSkip(skip + takeCount);
              } else {
                setFacilities(result.facilities);
                setSkip(takeCount);
              }
              setIsAllLoaded(false)
            } else {
              setIsAllLoaded(true)
            }
            let array = [];
            result.references.map(item => {
              array.push(item.facilityId);
            });
            setReferences(array);
          });
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setWaiting(false);
        setLoading(false);
        setRefreshing(false);
      });
  };
  useEffect(() => {
    setWaiting(true);
    loadData();
  }, []);

  const handleReference = id => {
    setWaiting(true);
    CFetch('/Management/ToggleDiscountCouponFacilityReference', token, {
      Id: route != undefined ? route.params.id : id,
      FacilityId: id,
    })
      .then(res => {
        if (res.status === 200) {
          res.json().then(result => {
            let array = [];
            result.map(item => array.push(item.facilityId));
            setReferences(array);
          });
        } else {
          Toast.show('Something went wrong, try again later');
        }
      })
      .catch(error => {
        Toast.show('No Internet Connection');
        console.log(error);
      })
      .finally(() => {
        setWaiting(false);
      });
  };

  const RenderItem = ({ item, index }) => {
    return (
      <View key={index} style={styles.checkboxContainer}>
        <Checkbox
          color={Colors.red}
          onPress={() => { addNew ? handleFacilityCheckBox(item.id) : handleReference(item.id) }}
          status={addNew ? discountFacility.includes(item.id) ? "checked" : "unchecked" :
            references.filter(g => g === item.id).length > 0
              ? 'checked'
              : 'unchecked'
          }
        />
        <Text onPress={() => { addNew ? handleFacilityCheckBox(item.id) : handleReference(item.id) }} style={{ padding: 10 }}>
          {item.name}
        </Text>
      </View>
    );
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
        ListFooterComponent={() => <Message loading={!isAllLoaded} />}
        ListEmptyComponent={() => <Message loading={false} message="No Facilities" height={400} />}
        contentContainerStyle={{ padding: 10 }}
        data={facilities}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => <RenderItem item={item} index={index} />}
        onEndReached={() => loadData(true)}
        onEndReachedThreshold={0.2}
      />
    </View>
  );
};

export default DiscountFacility;

const styles = StyleSheet.create({
  container: {
    // padding: 10,
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
