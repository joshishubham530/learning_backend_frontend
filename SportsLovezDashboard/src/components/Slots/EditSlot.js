import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import styles from '../../utilities/stylesheet';
import PreLoader from '../../utilities/PreLoader';
import { CFetch, CFormFetch } from '../../settings/APIFetch';
import { UserContext, AuthContext } from '../../settings/Context';
import Colors from '../../settings/Colors';
import { Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { WaitModal } from '../../utilities/PreLoader';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import { Title } from 'react-native-paper';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const EditSlot = ({ navigation, route }) => {
  const { signOut } = useContext(AuthContext);
  const { token, userName } = useContext(UserContext);
  const [items, setItems] = useState({
    isEditing: false,
    isReadOnly: false,
    isLoaded: false,
    isInternet: true,
    isError: false,
    isClicked: false,
  });
  const [slotId, setSlotId] = useState([]);
  const [slotIndex, setSlotIndex] = useState([]);
  const [startTime, setStartTime] = useState([]);
  const [endTime, setEndTime] = useState([]);
  const [amount, setAmount] = useState([]);
  const [response, setResponse] = useState(null);
  const [show, setShow] = useState([]);
  const [showE, setShowE] = useState([]);
  const [useTime, setUseTime] = useState([]);
  const [useTimeE, setUseTimeE] = useState([]);
  const [data, setData] = useState([]);
  const [dateItem, setDateItem] = useState({
    showDate: null,
    useDate: null,
    mode: 'date',
    show: [],
    date: new Date(),
  });

  const loadData = () => {
    CFetch('/Management/GetEditSlot?id=' + route.params.id + '&StartTime=' + route.params.startTime, token, {})
      .then(res => {
        if (res.status == 200) {
          res.json().then(result => {
            setResponse(result);
            setData(result.data);
            result.data.map(
              item => (
                slotId.push(item.id),
                slotIndex.push(item.slotIndex),
                startTime.push(item.startTime),
                useTime.push(item.startTime),
                endTime.push(item.endTime),
                useTimeE.push(item.endTime),
                amount.push(item.amount),
                show.push(false),
                showE.push(false)
              ),
            );
          });
        } else {
          setItems({ ...items, isError: true, isLoaded: true, isInternet: true });
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
            isEditing: false,
            isReadOnly: false,
            isLoaded: true,
            isInternet: true,
            isError: false,
          });
        }, 1);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const showMode = (currentMode, slot) => {
    setDateItem({ ...dateItem, mode: currentMode });
    show[slot] = true;
  };

  const showDatepicker = slot => {
    showMode('time', slot);
  };
  const onChangeDate = (event, currentDate, slot) => {
    if (event === "ios") {
      var newArray = [...startTime];
      show[slot] = false;
      newArray[slot] = new Date(currentDate).toLocaleString();
      setStartTime(newArray);
      useTime[slot] = new Date(currentDate).toISOString();
      return false
    }
    if (event.type == 'set') {
      var newArray = [...startTime];
      show[slot] = false;
      newArray[slot] = new Date(currentDate).toLocaleString();
      setStartTime(newArray);
      useTime[slot] = new Date(currentDate).toISOString();
    } else {
      show[slot] = false;
    }
  };
  const showModeE = (currentMode, slot) => {
    setDateItem({ ...dateItem, mode: currentMode });
    showE[slot] = true;
  };

  const showDatepickerE = slot => {
    showModeE('time', slot);
  };
  const onChangeDateE = (event, currentDate, slot) => {
    if (event === "ios") {
      showE[slot] = false;
      var newArray = [...endTime];
      newArray[slot] = new Date(currentDate).toLocaleString();
      setEndTime(newArray);
      useTimeE[slot] = new Date(currentDate).toISOString();
      return false
    }
    if (event.type == 'set') {
      showE[slot] = false;
      var newArray = [...endTime];
      newArray[slot] = new Date(currentDate).toLocaleString();
      setEndTime(newArray);
      useTimeE[slot] = new Date(currentDate).toISOString();
    } else {
      showE[slot] = false;
    }
  };
  function handleUpdateSlot() {
    var formData = new FormData();
    slotId.map(item => formData.append('Id', item));
    useTime.map(item => formData.append('StartTime', item));
    useTimeE.map(item => formData.append('EndTime', item));
    amount.map(item => formData.append('Amount', item));
    setItems({
      ...items,
      isClicked: true,
      isAuth: true,
    });
    CFormFetch('/Management/UpdateSlot', token, formData)
      .then(res => {
        if (res.status == 200) {
          navigation.navigate('Configure', {
            id: route.params.id,
            name: route.params.facilityName,
          });
        } else if (res.status == 111) {
          setItems({
            ...items,
            isClicked: false,
          });
          Toast.show(
            'Invalid start or end time, start time must be greater then preview slot end time.',
            Toast.LONG,
          );
        } else {
          setItems({
            ...items,
            isClicked: false,
          });
          Toast.show('Something went wrong', Toast.SHORT);
        }
      })
      .catch(error => {
        setItems({
          ...items,
          isClicked: false,
        });
        Toast.show('No Internet Connection', Toast.SHORT);
      });
  }
  const onChangeText = (index, val) => {
    let newArray = [...amount];
    newArray[index] = val;
    setAmount(newArray);
  };
  return (
    <>
      {items.isLoaded ? <WaitModal modalVisible={items.isClicked} /> : null}
      {!items.isLoaded && items.isInternet ? (
        <PreLoader />
      ) : !items.isInternet ? (
        <View
          style={[
            styles.container,
            { justifyContent: 'center', alignItems: 'center' },
          ]}>
          <Text style={{ marginBottom: 10 }}>No Internet Connection</Text>
          <Button
            title="Retry"
            color={Colors.blue}
            onPress={() =>
              setItems({ ...items, isLoaded: false, isInternet: true })
            }
          />
        </View>
      ) : items.isInternet && items.isError == true ? (
        <View
          style={[
            styles.container,
            { justifyContent: 'center', alignItems: 'center' },
          ]}>
          <Text style={{ marginBottom: 10 }}>Something went wrong.</Text>
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
        response ?
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={[styles.container, { padding: 10 }]}>
              <Title style={{ color: 'green' }}>
                {new Date(response.title).toDateString()}
              </Title>
              {data.map(item => (
                <View style={{ padding: 10 }} key={data.indexOf(item)}>
                  <Text>Slot {slotIndex[data.indexOf(item)]}</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 10,
                    }}>
                    <Text>Time </Text>
                    <View>
                      <TouchableOpacity
                        onPress={() => showDatepicker(data.indexOf(item))}>
                        <TextInput
                          style={[mstyles.cinputTxt, { width: 110 }]}
                          selectionColor="#009783"
                          placeholderTextColor="#949494"
                          placeholder="To Date"
                          value={
                            startTime[data.indexOf(item)]
                              .substring(11, 16)
                              .split(':')[0] >= 12
                              ? startTime[data.indexOf(item)]
                                .substring(11, 16)
                                .split(':')[0] > 12
                                ? (
                                  startTime[data.indexOf(item)]
                                    .substring(11, 16)
                                    .split(':')[0] - 12
                                ).toString().length == 1
                                  ? '0' +
                                  (
                                    startTime[data.indexOf(item)]
                                      .substring(11, 16)
                                      .split(':')[0] - 12
                                  ).toString() +
                                  ':' +
                                  startTime[data.indexOf(item)]
                                    .substring(11, 16)
                                    .split(':')[1] +
                                  ' PM'
                                  : startTime[data.indexOf(item)]
                                    .substring(11, 16)
                                    .split(':')[0] -
                                  12 +
                                  ':' +
                                  startTime[data.indexOf(item)]
                                    .substring(11, 16)
                                    .split(':')[1] +
                                  ' PM'
                                : startTime[data.indexOf(item)].substring(
                                  11,
                                  16,
                                ) + ' PM'
                              : startTime[data.indexOf(item)]
                                .toLocaleString()
                                .substring(11, 16)
                                .split(':')[0] == 0
                                ? (
                                  parseInt(
                                    startTime[data.indexOf(item)]
                                      .toLocaleString()
                                      .substring(11, 16)
                                      .split(':')[0],
                                  ) + 12
                                ).toString() +
                                ':' +
                                startTime[data.indexOf(item)]
                                  .toLocaleString()
                                  .substring(11, 16)
                                  .split(':')[1] +
                                ' AM'
                                : startTime[data.indexOf(item)]
                                  .toLocaleString()
                                  .substring(11, 16) + ' AM'
                          }
                          editable={false}
                        />
                        <View style={mstyles.calender}>
                          <Icon name="calendar" size={15} color={'white'} />
                        </View>
                      </TouchableOpacity>
                      {show[data.indexOf(item)] && (
                        <DateTimePicker
                          testID="dateTimePicker"
                          value={dateItem.date}
                          mode={dateItem.mode}
                          is24Hour={false}
                          display="default"
                          onChange={(event, currentDate) => {
                            Platform.OS === "ios" ?
                              onChangeDate('ios', currentDate, data.indexOf(item)) :
                              onChangeDate(event, currentDate, data.indexOf(item));
                          }}
                          minimumDate={dateItem.date}
                        />
                      )}
                    </View>
                    <Text> - </Text>
                    <View>
                      <TouchableOpacity
                        onPress={() => showDatepickerE(data.indexOf(item))}>
                        <TextInput
                          style={[mstyles.cinputTxt, { width: 110 }]}
                          selectionColor="#009783"
                          placeholderTextColor="#949494"
                          placeholder="To Date"
                          value={
                            endTime[data.indexOf(item)]
                              .substring(11, 16)
                              .split(':')[0] >= 12
                              ? endTime[data.indexOf(item)]
                                .substring(11, 16)
                                .split(':')[0] > 12
                                ? (
                                  endTime[data.indexOf(item)]
                                    .substring(11, 16)
                                    .split(':')[0] - 12
                                ).toString().length == 1
                                  ? '0' +
                                  (
                                    endTime[data.indexOf(item)]
                                      .substring(11, 16)
                                      .split(':')[0] - 12
                                  ).toString() +
                                  ':' +
                                  endTime[data.indexOf(item)]
                                    .substring(11, 16)
                                    .split(':')[1] +
                                  ' PM'
                                  : endTime[data.indexOf(item)]
                                    .substring(11, 16)
                                    .split(':')[0] -
                                  12 +
                                  ':' +
                                  endTime[data.indexOf(item)]
                                    .substring(11, 16)
                                    .split(':')[1] +
                                  ' PM'
                                : endTime[data.indexOf(item)].substring(11, 16) +
                                ' PM'
                              : endTime[data.indexOf(item)]
                                .toLocaleString()
                                .substring(11, 16)
                                .split(':')[0] == 0
                                ? (
                                  parseInt(
                                    endTime[data.indexOf(item)]
                                      .toLocaleString()
                                      .substring(11, 16)
                                      .split(':')[0],
                                  ) + 12
                                ).toString() +
                                ':' +
                                endTime[data.indexOf(item)]
                                  .toLocaleString()
                                  .substring(11, 16)
                                  .split(':')[1] +
                                ' AM'
                                : endTime[data.indexOf(item)]
                                  .toLocaleString()
                                  .substring(11, 16) + ' AM'
                          }
                          editable={false}
                        />
                        <View style={mstyles.calender}>
                          <Icon name="calendar" size={15} color={'white'} />
                        </View>
                      </TouchableOpacity>
                      {showE[data.indexOf(item)] && (
                        <DateTimePicker
                          testID="dateTimePicker"
                          value={dateItem.date}
                          mode={dateItem.mode}
                          is24Hour={false}
                          display="default"
                          onChange={(event, currentDate) => {
                            Platform.OS === "ios" ?
                              onChangeDateE('ios', currentDate, data.indexOf(item)) :
                              onChangeDateE(event, currentDate, data.indexOf(item));
                          }}
                          minimumDate={dateItem.date}
                        />
                      )}
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 10,
                    }}>
                    <Text>Rent: </Text>
                    <TextInput
                      keyboardType="numeric"
                      style={{
                        borderColor: 'gray',
                        borderWidth: 1,
                        width: 95,
                        paddingVertical: 0,
                        paddingLeft: 10,
                        paddingHorizontal: 5,
                        color: 'black',
                      }}
                      onChangeText={val => onChangeText(data.indexOf(item), val)}
                      value={amount[data.indexOf(item)].toString()}
                    />
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
          : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'red' }}>Something went wrong</Text>
          </View>
      )}
      {response ? <View style={{ flexDirection: 'row', width: width }}>
        <View style={{ width: '50%' }}>
          <Button
            title="Cancel"
            color={Colors.red}
            // onPress={() => navigation.navigate('SlotsList', {})}
            onPress={() => navigation.navigate('Configure', {})}
          />
        </View>
        <View style={{ width: '50%' }}>
          <Button
            title="Update"
            color={Colors.blue}
            onPress={() => handleUpdateSlot()}
          />
        </View>
      </View> : null}
    </>
  );
};

export default EditSlot;

const mstyles = StyleSheet.create({
  mainContainer: { padding: 10, marginHorizontal: '8%' },
  pcontainer: {
    width: width,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  table: {
    marginTop: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 3,
  },
  trfirst: {
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tr: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopColor: 'white',
    borderTopWidth: 1,
    padding: 5,
  },
  td: {
    width: 80,
    padding: 5,
  },
  tdRight: {
    padding: 5,
  },
  inputTxt: {
    borderColor: 'gray',
    color: 'black',
    borderWidth: 1,
    width: 50,
    paddingVertical: 0,
    paddingHorizontal: 10,
    textAlign: 'center',
  },

  cinputTxt: {
    borderColor: 'gray',
    color: 'black',
    borderWidth: 1,
    width: 95,
    paddingVertical: 0,
    paddingLeft: 10,
    paddingHorizontal: 5,
  },
  calender: {
    position: 'absolute',
    right: 0,
    justifyContent: 'center',
    padding: 5,
    backgroundColor: 'gray',
    height: '100%',
  },
  centeredView: {
    backgroundColor: '#080808ad',
    flex: 1,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '80%',
    margin: 0,
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
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: 'red',
    marginRight: 20,
  },
  buttonConfirm: {
    backgroundColor: 'green',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    fontSize: 20,
    color: Colors.red,
    textAlign: 'center',
  },
});
