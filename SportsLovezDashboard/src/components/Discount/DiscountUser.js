import React, { useContext, useEffect, useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View, RefreshControl, TextInput } from 'react-native';
import { CFetch } from '../../settings/APIFetch';
import { UserContext } from '../../settings/Context';
import { Checkbox } from 'react-native-paper';
import Toast from 'react-native-simple-toast';
import PreLoader, { WaitModal } from '../../utilities/PreLoader';
import Colors from '../../settings/Colors';
import Message from '../../utilities/Message'
const DiscountUser = ({ route }) => {
  const { token } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [waiting, setWaiting] = useState(false);
  const [isAllLoaded, setIsAllLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState([]);
  const [references, setReferences] = useState([]);
  const [search, setSearch] = useState("")
  const takeCount = 15;
  const [skip, setSkip] = useState(takeCount);
  const refresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  });
  const loadData = isSkip => {
    CFetch('/Management/CheckDiscountCouponUserReference', token, {
      Id: route.params.id,
      skip: isSkip ? skip : 0,
      take: takeCount,
      Username: search ? search : null
    })
      .then(res => {
        if (res.status === 200) {
          res.json().then(result => {
            if (result.users.length > 0) {
              if (isSkip) {
                setUsers([...users, ...result.users]);
                setSkip(skip + takeCount);
              } else {
                setUsers(result.users);
                setSkip(takeCount);
              }
              setIsAllLoaded(false)
            } else {
              setIsAllLoaded(true)
            }
            let array = [];
            result.references.map(item => {
              array.push(item.username);
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
  useEffect(() => {
    setUsers([])
    loadData();
  }, [search]);

  const handleReference = username => {
    setWaiting(true);
    CFetch('/Management/ToggleDiscountCouponUserReference', token, {
      Id: route.params.id,
      Username: username,
    })
      .then(res => {
        if (res.status === 200) {
          res.json().then(result => {
            let array = [];
            result.map(item => array.push(item.username));
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
          onPress={() => handleReference(item.userName)}
          status={
            references.filter(g => g === item.userName).length > 0
              ? 'checked'
              : 'unchecked'
          }
        />
        <Text
          onPress={() => handleReference(item.userName)}
          style={{ padding: 10 }}>
          {item.fullName}
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
      <TextInput style={{ margin: 10, borderWidth: 1, padding: 5, borderRadius: 5, borderColor: 'gray' }} onChangeText={(val) => setSearch(val)} placeholder="Search..." />
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        ListFooterComponent={() => <Message loading={!isAllLoaded} />}
        ListEmptyComponent={() => <Message loading={false} message="No Users" height={400} />}
        contentContainerStyle={{ padding: 10 }}
        data={users}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => <RenderItem item={item} index={index} />}
        onEndReached={() => loadData(true)}
        onEndReachedThreshold={0.2}
      />
    </View>
  );
};

export default DiscountUser;

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
