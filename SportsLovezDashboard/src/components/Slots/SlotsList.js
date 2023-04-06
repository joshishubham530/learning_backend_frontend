import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  View,
  Text,
  Button,
  RefreshControl,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  Platform,
  SafeAreaView,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import styles from '../../utilities/stylesheet';
import PreLoader from '../../utilities/PreLoader';
import {CFetch} from '../../settings/APIFetch';
import {UserContext, AuthContext} from '../../settings/Context';
import Colors from '../../settings/Colors';
import {Dimensions} from 'react-native';
import FlatlistFooter from '../../utilities/FlatListFooter';
import {WaitModal} from '../../utilities/PreLoader';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import {Title} from 'react-native-paper';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const SlotsList = ({route, id, timeStamp, filter, name, facilityName}) => {
  const navigation = useNavigation();
  const {signOut} = useContext(AuthContext);
  const {token, userName} = useContext(UserContext);
  const [items, setItems] = useState({
    isEditing: false,
    isReadOnly: false,
    isLoaded: false,
    isInternet: true,
    isError: false,
    isClicked: false,
  });
  const [response, setResponse] = useState([]);
  const [isAllLoaded, setIsAllLoaded] = useState(false);
  const [skip, setSkip] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const onRefresh = useCallback(() => {
    setItems({...items, isLoaded: false});
    loadData();
  }, []);
  const loadData = () => {
    CFetch(
      '/Management/SlotsList?id=' +
        id +
        '&TimeStamp=' +
        timeStamp +
        '&filter=' +
        filter,
      token,
      {},
    )
      .then(res => {
        if (res.status == 200) {
          res.json().then(result => {
            setResponse(result);
          });
          setSkip(30);
        } else {
          setItems({...items, isError: true, isLoaded: true, isInternet: true});
          Toast.show('Something went wrong', Toast.SHORT);
        }
      })
      .catch(error => {
        setItems({
          ...items,
          isInternet: false,
          isLoaded: true,
          isError: false,
        });
        Toast.show('No Internet Connection', Toast.SHORT);
      })
      .finally(() => {
        setTimeout(() => {
          setItems({
            ...items,
            isClicked: false,
            isEditing: false,
            isReadOnly: false,
            isLoaded: true,
            isInternet: true,
            isError: false,
          });
        }, 1);
      });
  };

  const deleteSlots = () => {
    setModalVisible(false);
    setItems({...items, isClicked: true});
    CFetch('/Management/DeleteSlots?timeStamp=' + timeStamp, token, {})
      .then(res => {
        if (res.status == 200) {
          navigation.navigate('Configure', {id: id});
        } else {
          Toast.show('Something went wrong', Toast.SHORT);
        }
      })
      .catch(error => {
        Toast.show('No Internet Connection', Toast.SHORT);
      });
  };
  const handleEnableDisable = id => {
    setItems({...items, isClicked: true});
    CFetch('/Management/EnableDisableSlot?id=' + id, token, {})
      .then(res => {
        if (res.status == 200) {
          loadData();
        } else {
          Toast.show('Something went wrong', Toast.SHORT);
        }
      })
      .catch(error => {
        Toast.show('No Internet Connection', Toast.SHORT);
      })
      .finally(() => {
        setItems({...items, isClicked: false});
      });
  };
  const handleEnableDisableList = (id, date, start, status) => {
    setItems({...items, isClicked: true});
    CFetch(
      '/Management/EnableDisableSlotList?id=' +
        id +
        '&date=' +
        date +
        '&start=' +
        start +
        '&status=' +
        status,
      token,
      {},
    )
      .then(res => {
        if (res.status == 200) {
          loadData();
        } else {
          Toast.show('Something went wrong', Toast.SHORT);
        }
      })
      .catch(error => {
        Toast.show('No Internet Connection', Toast.SHORT);
      })
      .finally(() => {
        setItems({...items, isClicked: false});
      });
  };
  // React.useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <TouchableOpacity
  //         style={{ padding: 15 }}
  //         onPress={() => {
  //           setModalVisible(true);
  //         }}>
  //         <Icon name="trash-alt" size={16} color="white" />
  //       </TouchableOpacity>
  //     ),
  //   });
  // }, [navigation]);
  useFocusEffect(
    useCallback(() => {
      setItems({
        ...items,
        isClicked: true,
        isLoaded: true,
      });
      console.log();
      loadData();
      return () => false;
    }, []),
  );
  useEffect(() => {
    setItems({
      ...items,
      isClicked: true,
      isLoaded: Platform.OS === 'ios' ? false : items.isLoaded,
    });
    loadData();
  }, [timeStamp, filter]);
  const loadMore = () => {
    CFetch(
      '/Management/SlotsList?id=' +
        id +
        '&TimeStamp=' +
        timeStamp +
        '&filter=' +
        filter +
        '&skip=' +
        skip,
      token,
      {},
    )
      .then(res => {
        if (res.status == 200) {
          res.json().then(result => {
            if (result.length != 0) {
              setResponse([...response, ...result]);
              setSkip(skip + 30);
            } else {
              setIsAllLoaded(true);
            }
          });
        }
      })
      .catch(error => {
        setItems({
          ...items,
          isInternet: false,
        });
        Toast.show('No Internet Connection.', Toast.SHORT);
      });
  };
  const Item = ({item}) => (
    <View key={response.indexOf(item)} style={{padding: 10}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Title style={{color: 'green'}}>
          {new Date(item.title).toDateString()}
        </Title>
        {item.isAllEnableDisable && (
          <TouchableOpacity
            style={{padding: 5, marginLeft: 'auto', marginRight: 10}}
            onPress={() =>
              handleEnableDisableList(
                id,
                item.data[0].timeStamp,
                item.data[0].startTime,
                !item.isAllActive,
              )
            }>
            <Icon
              name={item.isAllActive ? 'toggle-on' : 'toggle-off'}
              color={item.isAllActive ? 'green' : Colors.red}
              size={20}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={{padding: 5}}
          onPress={() =>
            navigation.navigate('EditSlot', {
              id: id,
              startTime: item.title,
              facilityName: facilityName,
              name: name,
            })
          }>
          <Icon name="pencil-alt" color="green" />
        </TouchableOpacity>
      </View>
      {item.data.map(data => (
        <TouchableOpacity
          disabled={data.bookingId == 0}
          onPress={() => {
            navigation.navigate('BookingDetail', {id: data.bookingId});
          }}
          key={item.data.indexOf(data)}>
          <Text
            key={item.data.indexOf(data)}
            style={{
              color: data.bookingId == 0 ? 'black' : 'white',
              backgroundColor: data.bookingId == 0 ? 'white' : Colors.red,
              borderWidth: 1,
              borderColor: 'gray',
              fontSize: 19,
              padding: 10,
              marginBottom: 10,
              textAlign: 'center',
              textAlignVertical: 'center',
            }}>
            Slot {data.slotIndex}
            {'  '}
            {data.startTime.substring(11, 16).split(':')[0] >= 12
              ? data.startTime.substring(11, 16).split(':')[0] > 12
                ? (
                    data.startTime.substring(11, 16).split(':')[0] - 12
                  ).toString().length == 1
                  ? '0' +
                    (
                      data.startTime.substring(11, 16).split(':')[0] - 12
                    ).toString() +
                    ':' +
                    data.startTime.substring(11, 16).split(':')[1] +
                    ' PM'
                  : data.startTime.substring(11, 16).split(':')[0] -
                    12 +
                    ':' +
                    data.startTime.substring(11, 16).split(':')[1] +
                    ' PM'
                : data.startTime.substring(11, 16) + ' PM'
              : data.startTime.substring(11, 16) + ' AM'}
            {' - '}
            {data.endTime.substring(11, 16).split(':')[0] >= 12
              ? data.endTime.substring(11, 16).split(':')[0] > 12
                ? (data.endTime.substring(11, 16).split(':')[0] - 12).toString()
                    .length == 1
                  ? '0' +
                    (
                      data.endTime.substring(11, 16).split(':')[0] - 12
                    ).toString() +
                    ':' +
                    data.endTime.substring(11, 16).split(':')[1] +
                    ' PM'
                  : data.endTime.substring(11, 16).split(':')[0] -
                    12 +
                    ':' +
                    data.endTime.substring(11, 16).split(':')[1] +
                    ' PM'
                : data.endTime.substring(11, 16) + ' PM'
              : data.endTime.substring(11, 16) + ' AM'}{' '}
            ₹ {data.amount}
            {data.isEnableDisable && data.bookingId == 0 ? (
              <View style={{alignSelf: 'center'}}>
                {data.isActive ? (
                  <TouchableOpacity
                    style={{padding: 5}}
                    onPress={() => handleEnableDisable(data.id)}>
                    <Icon name="toggle-on" color="green" size={16} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{padding: 5}}
                    onPress={() => handleEnableDisable(data.id)}>
                    <Icon name="toggle-off" color={Colors.red} size={16} />
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View>
                <Icon name="eye" color="white" style={{marginLeft: 10}} />
              </View>
            )}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderItem = ({item}) => <Item item={item} />;

  return (
    <>
      {items.isLoaded ? <WaitModal modalVisible={items.isClicked} /> : null}
      {!items.isLoaded && items.isInternet ? (
        <PreLoader />
      ) : !items.isInternet ? (
        <View
          style={[
            styles.container,
            {justifyContent: 'center', alignItems: 'center'},
          ]}>
          <Text style={{marginBottom: 10}}>No Internet Connection</Text>
          <Button
            title="Retry"
            color={Colors.blue}
            onPress={() =>
              setItems({...items, isLoaded: false, isInternet: true})
            }
          />
        </View>
      ) : items.isInternet && items.isError == true ? (
        <View
          style={[
            styles.container,
            {justifyContent: 'center', alignItems: 'center'},
          ]}>
          <Text style={{marginBottom: 10}}>Something went wrong.</Text>
          <Button
            title="Retry"
            color={Colors.blue}
            onPress={() => {
              setItems({
                ...items,
                isLoaded: false,
                isInternet: true,
                isError: false,
              }),
                loadData();
            }}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <FlatList
            ListFooterComponent={() =>
              response.length ? (
                <FlatlistFooter
                  isAllLoaded={isAllLoaded}
                  message="No more items to show."
                />
              ) : null
            }
            ListEmptyComponent={() => (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: height / 2,
                }}>
                <Text style={{color: 'red'}}>No Items to show</Text>
              </View>
            )}
            data={response}
            keyExtractor={item => response.indexOf(item).toString()}
            renderItem={renderItem}
            onEndReached={loadMore}
            onEndReachedThreshold={0.2}
            refreshControl={
              <RefreshControl
                refreshing={!items.isLoaded}
                onRefresh={onRefresh}
              />
            }
          />
        </View>
      )}
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <SafeAreaView style={{flex: 1}}>
          <Pressable
            style={mstyles.centeredView}
            onPressOut={() => setModalVisible(false)}>
            <Pressable style={mstyles.modalView}>
              <Text style={mstyles.modalText}>
                Are you sure to delete this range?
              </Text>
              <View
                style={{flexDirection: 'row', marginBottom: 10, marginTop: 15}}>
                <Pressable
                  style={[mstyles.button, mstyles.buttonConfirm]}
                  onPress={() => deleteSlots()}>
                  <Text style={mstyles.textStyle}>Yes</Text>
                </Pressable>
                <Pressable
                  style={[mstyles.button, mstyles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={mstyles.textStyle}>No</Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default SlotsList;

const mstyles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    backgroundColor: '#f1f1f1',
    padding: 10,
    paddingLeft: 20,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  centeredView: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 170,
  },
  modalView: {
    width: '80%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 15,
  },
  button: {
    borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: 'red',
  },
  buttonConfirm: {
    backgroundColor: 'green',
    marginRight: 20,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    fontSize: 20,
    textAlign: 'center',
  },
});
