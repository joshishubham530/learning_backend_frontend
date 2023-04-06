import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  View,
  Text,
  Button,
  Modal,
  Pressable,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  SafeAreaView,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import styles from '../../utilities/stylesheet';
import PreLoader from '../../utilities/PreLoader';
import {UserContext, AuthContext} from '../../settings/Context';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-date-picker';
import Colors from '../../settings/Colors';
import {Dimensions} from 'react-native';
import {Title} from 'react-native-paper';
import {WaitModal} from '../../utilities/PreLoader';
import {CFetch, CFormFetch} from '../../settings/APIFetch';
var w = Dimensions.get('window').width;
var h = Dimensions.get('window').height;
const UpdateConfigureSlot1 = ({navigation, route}) => {
  const {token} = useContext(UserContext);
  const [items, setItems] = useState({
    isEditing: false,
    isReadOnly: false,
    isLoaded: false,
    isInternet: true,
    isError: false,
  });
  const [waiting, setWaiting] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const fix = new Date(0, 0, 0, 6, 0, 0);
  const [rangeName, setRangeName] = useState('');
  const [weekDays, setWeekDays] = useState({
    slotSize: 3.5,
    day1: fix,
    daySlot1: 3,
    day2: fix,
    daySlot2: 3,
    day3: fix,
    daySlot3: 3,
    day4: fix,
    daySlot4: 3,
    day5: fix,
    daySlot5: 3,
    day6: fix,
    daySlot6: 3,
    day7: fix,
    daySlot7: 3,
  });
  const loadData = () => {
    setWaiting(true);
    CFetch('/Management/GetConfigureSlot', token, {
      facilityId: route.params.id,
      timeStamp: route.params.timeStamp,
    })
      .then(res => {
        if (res.status === 200) {
          res.json().then(result => {
            setWeekDays({
              ...weekDays,
              slotSize: result.slotSize,
              daySlot1: result.monday != 0 ? result.monday : 3,
              daySlot2: result.tuesday != 0 ? result.tuesday : 3,
              daySlot3: result.wednesday != 0 ? result.wednesday : 3,
              daySlot4: result.thursday != 0 ? result.thursday : 3,
              daySlot5: result.friday != 0 ? result.friday : 3,
              daySlot6: result.saturday != 0 ? result.saturday : 3,
              daySlot7: result.sunday != 0 ? result.sunday : 3,
              day1: new Date(
                0,
                0,
                0,
                parseInt(result.mondayStartTime.split('T')[1].split(':')[0]),
                parseInt(result.mondayStartTime.split('T')[1].split(':')[1]),
                0,
              ),
              day2: new Date(
                0,
                0,
                0,
                parseInt(result.tuesdayStartTime.split('T')[1].split(':')[0]),
                parseInt(result.tuesdayStartTime.split('T')[1].split(':')[1]),
                0,
              ),
              day3: new Date(
                0,
                0,
                0,
                parseInt(result.wednesdayStartTime.split('T')[1].split(':')[0]),
                parseInt(result.wednesdayStartTime.split('T')[1].split(':')[1]),
                0,
              ),
              day4: new Date(
                0,
                0,
                0,
                parseInt(result.thursdayStartTime.split('T')[1].split(':')[0]),
                parseInt(result.thursdayStartTime.split('T')[1].split(':')[1]),
                0,
              ),
              day5: new Date(
                0,
                0,
                0,
                parseInt(result.fridayStartTime.split('T')[1].split(':')[0]),
                parseInt(result.fridayStartTime.split('T')[1].split(':')[1]),
                0,
              ),
              day6: new Date(
                0,
                0,
                0,
                parseInt(result.saturdayStartTime.split('T')[1].split(':')[0]),
                parseInt(result.saturdayStartTime.split('T')[1].split(':')[1]),
                0,
              ),
              day7: new Date(
                0,
                0,
                0,
                parseInt(result.sundayStartTime.split('T')[1].split(':')[0]),
                parseInt(result.sundayStartTime.split('T')[1].split(':')[1]),
                0,
              ),
            });
            setRangeName(result.name);
            setFromDate(result.fromDate);
            setToDate(result.toDate);
          });
        }
      })
      .finally(() => {
        setWaiting(false);
      });
  };
  useEffect(() => {
    if (route.params.timeStamp) {
      loadData();
    }
  }, []);
  const [dateItem, setDateItem] = useState({
    showDate: null,
    useDate: null,
    mode: 'date',
    show1: false,
    show2: false,
    show3: false,
    show4: false,
    show5: false,
    show6: false,
    show7: false,
    date: new Date(0, 0, 0, 6, 0, 0),
  });
  useEffect(() => {
    setItems({...items, isLoaded: true});
  }, [items.isLoaded]);

  const showMode = (currentMode, day) => {
    if (day == 1) {
      setDateItem({...dateItem, show1: true, mode: currentMode});
    } else if (day == 2) {
      setDateItem({...dateItem, show2: true, mode: currentMode});
    } else if (day == 3) {
      setDateItem({...dateItem, show3: true, mode: currentMode});
    } else if (day == 4) {
      setDateItem({...dateItem, show4: true, mode: currentMode});
    } else if (day == 5) {
      setDateItem({...dateItem, show5: true, mode: currentMode});
    } else if (day == 6) {
      setDateItem({...dateItem, show6: true, mode: currentMode});
    } else if (day == 7) {
      setDateItem({...dateItem, show7: true, mode: currentMode});
    }
  };

  const showDatepicker = day => {
    showMode('time', day);
  };
  const sameSlot = () => {
    Alert.alert('Auto fill slots ', 'Same Slots from Monday to Sunday ?', [
      {
        text: 'No',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          sameSlotCount(weekDays.daySlot1);
        },
      },
    ]);
  };
  const sameSlotCount = val => {
    setWeekDays({
      ...weekDays,
      daySlot2: val,
      daySlot3: val,
      daySlot4: val,
      daySlot5: val,
      daySlot6: val,
      daySlot7: val,
    });
  };
  const sameSlot2 = () => {
    Alert.alert('Auto fill slots ', 'Same Slots for Sunday ?', [
      {
        text: 'No',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          sameSlotCount2(weekDays.daySlot6);
        },
      },
    ]);
  };
  const sameSlotCount2 = val => {
    setWeekDays({
      ...weekDays,
      daySlot7: val,
    });
  };
  const sameTime = val => {
    Alert.alert(
      'Auto fill Start Time ',
      'Same Start Time from Monday to Sunday ?',
      [
        {
          text: 'No',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            sameTimeConfirm(val);
          },
        },
      ],
    );
  };
  const sameTimeConfirm = val => {
    setWeekDays({
      ...weekDays,
      day1: val,
      day2: val,
      day3: val,
      day4: val,
      day5: val,
      day6: val,
      day7: val,
    });
  };
  const sameTime2 = val => {
    Alert.alert('Auto fill Start Time ', 'Same Start Time for Sunday ?', [
      {
        text: 'No',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          sameTimeConfirm2(val);
        },
      },
    ]);
  };
  const sameTimeConfirm2 = val => {
    setWeekDays({
      ...weekDays,
      day6: val,
      day7: val,
    });
  };
  return (
    <>
      <WaitModal modalVisible={waiting} />
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
              });
            }}
          />
        </View>
      ) : (
        <>
          <ScrollView>
            <View style={[styles.container, {padding: 10}]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text>Slot Size</Text>
                <TextInput
                  keyboardType="numeric"
                  value={weekDays.slotSize.toString()}
                  onChangeText={val =>
                    setWeekDays({...weekDays, slotSize: val})
                  }
                  style={{
                    marginLeft: 10,
                    marginRight: 10,
                    borderColor: 'gray',
                    borderWidth: 1,
                    width: 70,
                    paddingVertical: 0,
                    paddingHorizontal: 10,
                    textAlign: 'center',
                  }}
                />
                <Text style={{fontStyle: 'italic', fontSize: 12}}>hours</Text>
              </View>
              <View style={mstyles.table}>
                <View style={mstyles.trfirst}>
                  <Text style={mstyles.td}>Monday</Text>
                  <TextInput
                    keyboardType="numeric"
                    value={weekDays.daySlot1.toString()}
                    onChangeText={val =>
                      setWeekDays({...weekDays, daySlot1: val})
                    }
                    onEndEditing={() => sameSlot()}
                    style={mstyles.inputTxt}
                  />
                  <View style={mstyles.tdRight}>
                    <TouchableOpacity onPress={() => showDatepicker(1)}>
                      <TextInput
                        style={[mstyles.cinputTxt]}
                        selectionColor="#009783"
                        placeholderTextColor="#949494"
                        placeholder="Start Time"
                        value={
                          weekDays.day1
                            .toLocaleString()
                            .substring(11, 16)
                            .split(':')[0] >= 12
                            ? weekDays.day1
                                .toLocaleString()
                                .substring(11, 16)
                                .split(':')[0] > 12
                              ? (
                                  weekDays.day1
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[0] - 12
                                ).toString().length == 1
                                ? '0' +
                                  (
                                    weekDays.day1
                                      .toLocaleString()
                                      .substring(11, 16)
                                      .split(':')[0] - 12
                                  ).toString() +
                                  ':' +
                                  weekDays.day1
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[1] +
                                  ' PM'
                                : weekDays.day1
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[0] -
                                  12 +
                                  ':' +
                                  weekDays.day1
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[1] +
                                  ' PM'
                              : weekDays.day1
                                  .toLocaleString()
                                  .substring(11, 16) + ' PM'
                            : weekDays.day1
                                .toLocaleString()
                                .substring(11, 16)
                                .split(':')[0] == 0
                            ? (
                                parseInt(
                                  weekDays.day1
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[0],
                                ) + 12
                              ).toString() +
                              ':' +
                              weekDays.day1
                                .toLocaleString()
                                .substring(11, 16)
                                .split(':')[1] +
                              ' AM'
                            : weekDays.day1.toLocaleString().substring(11, 16) +
                              ' AM'
                        }
                        editable={false}
                      />
                      <View style={mstyles.calender}>
                        <Icon name="angle-down" size={15} color={'white'} />
                      </View>
                    </TouchableOpacity>
                    {Platform.OS === 'ios' ? (
                      <DatePicker
                        modal
                        mode="time"
                        open={dateItem.show1}
                        date={dateItem.date}
                        minimumDate={dateItem.date}
                        onConfirm={date => {
                          setWeekDays({
                            ...weekDays,
                            day1: new Date(date),
                          });
                          setDateItem({...dateItem, show1: false});
                          sameTime(new Date(date));
                          return false;
                        }}
                        onCancel={() => {
                          setDateItem({...dateItem, show1: false});
                        }}
                      />
                    ) : (
                      dateItem.show1 && (
                        <DateTimePicker
                          testID="dateTimePicker"
                          value={dateItem.date}
                          mode="time"
                          is24Hour={false}
                          display="default"
                          onChange={(event, currentDate) => {
                            if (Platform.OS === 'ios') {
                              setWeekDays({
                                ...weekDays,
                                day1: new Date(currentDate),
                              });
                              setDateItem({...dateItem, show1: false});
                              sameTime(new Date(currentDate));
                              return false;
                            }
                            if (event.type == 'set') {
                              setWeekDays({
                                ...weekDays,
                                day1: new Date(currentDate),
                              }),
                                setDateItem({...dateItem, show1: false});
                              sameTime(new Date(currentDate));
                            }
                          }}
                          minimumDate={dateItem.date}
                        />
                      )
                    )}
                  </View>
                </View>
                <View style={mstyles.tr}>
                  <Text style={mstyles.td}>Tuesday</Text>
                  <TextInput
                    keyboardType="numeric"
                    value={weekDays.daySlot2.toString()}
                    onChangeText={val =>
                      setWeekDays({...weekDays, daySlot2: val})
                    }
                    style={mstyles.inputTxt}
                  />
                  <View style={mstyles.tdRight}>
                    <TouchableOpacity onPress={() => showDatepicker(2)}>
                      <TextInput
                        style={[mstyles.cinputTxt]}
                        selectionColor="#009783"
                        placeholderTextColor="#949494"
                        placeholder="Start Time"
                        value={
                          weekDays.day2
                            .toLocaleString()
                            .substring(11, 16)
                            .split(':')[0] >= 12
                            ? weekDays.day2
                                .toLocaleString()
                                .substring(11, 16)
                                .split(':')[0] > 12
                              ? (
                                  weekDays.day2
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[0] - 12
                                ).toString().length == 1
                                ? '0' +
                                  (
                                    weekDays.day2
                                      .toLocaleString()
                                      .substring(11, 16)
                                      .split(':')[0] - 12
                                  ).toString() +
                                  ':' +
                                  weekDays.day2
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[1] +
                                  ' PM'
                                : weekDays.day2
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[0] -
                                  12 +
                                  ':' +
                                  weekDays.day2
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[1] +
                                  ' PM'
                              : weekDays.day2
                                  .toLocaleString()
                                  .substring(11, 16) + ' PM'
                            : weekDays.day2
                                .toLocaleString()
                                .substring(11, 16)
                                .split(':')[0] == 0
                            ? (
                                parseInt(
                                  weekDays.day2
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[0],
                                ) + 12
                              ).toString() +
                              ':' +
                              weekDays.day2
                                .toLocaleString()
                                .substring(11, 16)
                                .split(':')[1] +
                              ' AM'
                            : weekDays.day2.toLocaleString().substring(11, 16) +
                              ' AM'
                        }
                        editable={false}
                      />
                      <View style={mstyles.calender}>
                        <Icon name="angle-down" size={15} color={'white'} />
                      </View>
                    </TouchableOpacity>
                    {Platform.OS === 'ios' ? (
                      <DatePicker
                        modal
                        mode="time"
                        open={dateItem.show2}
                        date={dateItem.date}
                        minimumDate={dateItem.date}
                        onConfirm={date => {
                          setWeekDays({
                            ...weekDays,
                            day2: new Date(date),
                          });
                          setDateItem({...dateItem, show2: false});
                          return false;
                        }}
                        onCancel={() => {
                          setDateItem({...dateItem, show2: false});
                        }}
                      />
                    ) : (
                      dateItem.show2 && (
                        <DateTimePicker
                          testID="dateTimePicker"
                          value={dateItem.date}
                          mode={dateItem.mode}
                          is24Hour={false}
                          display="default"
                          onChange={(event, currentDate) => {
                            if (Platform.OS === 'ios') {
                              setWeekDays({
                                ...weekDays,
                                day2: new Date(currentDate),
                              });
                              setDateItem({...dateItem, show2: false});
                              return false;
                            }
                            if (event.type == 'set')
                              setWeekDays({
                                ...weekDays,
                                day2: new Date(currentDate),
                              }),
                                setDateItem({...dateItem, show2: false});
                          }}
                          minimumDate={dateItem.date}
                        />
                      )
                    )}
                  </View>
                </View>
                <View style={mstyles.tr}>
                  <Text style={mstyles.td}>Wednesday</Text>
                  <TextInput
                    keyboardType="numeric"
                    value={weekDays.daySlot3.toString()}
                    onChangeText={val =>
                      setWeekDays({...weekDays, daySlot3: val})
                    }
                    style={mstyles.inputTxt}
                  />
                  <View style={mstyles.tdRight}>
                    <TouchableOpacity onPress={() => showDatepicker(3)}>
                      <TextInput
                        style={[mstyles.cinputTxt]}
                        selectionColor="#009783"
                        placeholderTextColor="#949494"
                        placeholder="Start Time"
                        value={
                          weekDays.day3
                            .toLocaleString()
                            .substring(11, 16)
                            .split(':')[0] >= 12
                            ? weekDays.day3
                                .toLocaleString()
                                .substring(11, 16)
                                .split(':')[0] > 12
                              ? (
                                  weekDays.day3
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[0] - 12
                                ).toString().length == 1
                                ? '0' +
                                  (
                                    weekDays.day3
                                      .toLocaleString()
                                      .substring(11, 16)
                                      .split(':')[0] - 12
                                  ).toString() +
                                  ':' +
                                  weekDays.day3
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[1] +
                                  ' PM'
                                : weekDays.day3
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[0] -
                                  12 +
                                  ':' +
                                  weekDays.day3
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[1] +
                                  ' PM'
                              : weekDays.day3
                                  .toLocaleString()
                                  .substring(11, 16) + ' PM'
                            : weekDays.day3
                                .toLocaleString()
                                .substring(11, 16)
                                .split(':')[0] == 0
                            ? (
                                parseInt(
                                  weekDays.day3
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[0],
                                ) + 12
                              ).toString() +
                              ':' +
                              weekDays.day3
                                .toLocaleString()
                                .substring(11, 16)
                                .split(':')[1] +
                              ' AM'
                            : weekDays.day3.toLocaleString().substring(11, 16) +
                              ' AM'
                        }
                        editable={false}
                      />
                      <View style={mstyles.calender}>
                        <Icon name="angle-down" size={15} color={'white'} />
                      </View>
                    </TouchableOpacity>
                    {Platform.OS === 'ios' ? (
                      <DatePicker
                        modal
                        mode="time"
                        open={dateItem.show3}
                        date={dateItem.date}
                        minimumDate={dateItem.date}
                        onConfirm={date => {
                          setWeekDays({
                            ...weekDays,
                            day3: new Date(date),
                          });
                          setDateItem({...dateItem, show3: false});
                          return false;
                        }}
                        onCancel={() => {
                          setDateItem({...dateItem, show3: false});
                        }}
                      />
                    ) : (
                      dateItem.show3 && (
                        <DateTimePicker
                          testID="dateTimePicker"
                          value={dateItem.date}
                          mode={dateItem.mode}
                          is24Hour={false}
                          display="default"
                          onChange={(event, currentDate) => {
                            if (Platform.OS === 'ios') {
                              setWeekDays({
                                ...weekDays,
                                day3: new Date(currentDate),
                              });
                              setDateItem({...dateItem, show3: false});
                              return false;
                            }
                            if (event.type == 'set')
                              setWeekDays({
                                ...weekDays,
                                day3: new Date(currentDate),
                              }),
                                setDateItem({...dateItem, show3: false});
                          }}
                          minimumDate={dateItem.date}
                        />
                      )
                    )}
                  </View>
                </View>
                <View style={mstyles.tr}>
                  <Text style={mstyles.td}>Thursday</Text>
                  <TextInput
                    keyboardType="numeric"
                    value={weekDays.daySlot4.toString()}
                    onChangeText={val =>
                      setWeekDays({...weekDays, daySlot4: val})
                    }
                    style={{
                      borderColor: 'gray',
                      borderWidth: 1,
                      width: 50,
                      paddingVertical: 0,
                      paddingHorizontal: 10,
                      textAlign: 'center',
                    }}
                  />
                  <View style={mstyles.tdRight}>
                    <TouchableOpacity onPress={() => showDatepicker(4)}>
                      <TextInput
                        style={[mstyles.cinputTxt]}
                        selectionColor="#009783"
                        placeholderTextColor="#949494"
                        placeholder="Start Time"
                        value={
                          weekDays.day4
                            .toLocaleString()
                            .substring(11, 16)
                            .split(':')[0] >= 12
                            ? weekDays.day4
                                .toLocaleString()
                                .substring(11, 16)
                                .split(':')[0] > 12
                              ? (
                                  weekDays.day4
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[0] - 12
                                ).toString().length == 1
                                ? '0' +
                                  (
                                    weekDays.day4
                                      .toLocaleString()
                                      .substring(11, 16)
                                      .split(':')[0] - 12
                                  ).toString() +
                                  ':' +
                                  weekDays.day4
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[1] +
                                  ' PM'
                                : weekDays.day4
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[0] -
                                  12 +
                                  ':' +
                                  weekDays.day4
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[1] +
                                  ' PM'
                              : weekDays.day4
                                  .toLocaleString()
                                  .substring(11, 16) + ' PM'
                            : weekDays.day4
                                .toLocaleString()
                                .substring(11, 16)
                                .split(':')[0] == 0
                            ? (
                                parseInt(
                                  weekDays.day4
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[0],
                                ) + 12
                              ).toString() +
                              ':' +
                              weekDays.day4
                                .toLocaleString()
                                .substring(11, 16)
                                .split(':')[1] +
                              ' AM'
                            : weekDays.day4.toLocaleString().substring(11, 16) +
                              ' AM'
                        }
                        editable={false}
                      />
                      <View style={mstyles.calender}>
                        <Icon name="angle-down" size={15} color={'white'} />
                      </View>
                    </TouchableOpacity>
                    {Platform.OS === 'ios' ? (
                      <DatePicker
                        modal
                        mode="time"
                        open={dateItem.show4}
                        date={dateItem.date}
                        minimumDate={dateItem.date}
                        onConfirm={date => {
                          setWeekDays({
                            ...weekDays,
                            day4: new Date(date),
                          });
                          setDateItem({...dateItem, show4: false});
                          return false;
                        }}
                        onCancel={() => {
                          setDateItem({...dateItem, show4: false});
                        }}
                      />
                    ) : (
                      dateItem.show4 && (
                        <DateTimePicker
                          testID="dateTimePicker"
                          value={dateItem.date}
                          mode={dateItem.mode}
                          is24Hour={false}
                          display="default"
                          onChange={(event, currentDate) => {
                            if (Platform.OS === 'ios') {
                              setWeekDays({
                                ...weekDays,
                                day4: new Date(currentDate),
                              });
                              setDateItem({...dateItem, show4: false});
                              return false;
                            }
                            if (event.type == 'set')
                              setWeekDays({
                                ...weekDays,
                                day4: new Date(currentDate),
                              }),
                                setDateItem({...dateItem, show4: false});
                          }}
                          minimumDate={dateItem.date}
                        />
                      )
                    )}
                  </View>
                </View>
                <View style={mstyles.tr}>
                  <Text style={mstyles.td}>Friday</Text>
                  <TextInput
                    keyboardType="numeric"
                    value={weekDays.daySlot5.toString()}
                    onChangeText={val =>
                      setWeekDays({...weekDays, daySlot5: val})
                    }
                    style={{
                      borderColor: 'gray',
                      borderWidth: 1,
                      width: 50,
                      paddingVertical: 0,
                      paddingHorizontal: 10,
                      textAlign: 'center',
                    }}
                  />
                  <View style={mstyles.tdRight}>
                    <TouchableOpacity onPress={() => showDatepicker(5)}>
                      <TextInput
                        style={[mstyles.cinputTxt]}
                        selectionColor="#009783"
                        placeholderTextColor="#949494"
                        placeholder="Start Time"
                        value={
                          weekDays.day5
                            .toLocaleString()
                            .substring(11, 16)
                            .split(':')[0] >= 12
                            ? weekDays.day5
                                .toLocaleString()
                                .substring(11, 16)
                                .split(':')[0] > 12
                              ? (
                                  weekDays.day5
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[0] - 12
                                ).toString().length == 1
                                ? '0' +
                                  (
                                    weekDays.day5
                                      .toLocaleString()
                                      .substring(11, 16)
                                      .split(':')[0] - 12
                                  ).toString() +
                                  ':' +
                                  weekDays.day5
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[1] +
                                  ' PM'
                                : weekDays.day5
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[0] -
                                  12 +
                                  ':' +
                                  weekDays.day5
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[1] +
                                  ' PM'
                              : weekDays.day5
                                  .toLocaleString()
                                  .substring(11, 16) + ' PM'
                            : weekDays.day5
                                .toLocaleString()
                                .substring(11, 16)
                                .split(':')[0] == 0
                            ? (
                                parseInt(
                                  weekDays.day5
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[0],
                                ) + 12
                              ).toString() +
                              ':' +
                              weekDays.day5
                                .toLocaleString()
                                .substring(11, 16)
                                .split(':')[1] +
                              ' AM'
                            : weekDays.day5.toLocaleString().substring(11, 16) +
                              ' AM'
                        }
                        editable={false}
                      />
                      <View style={mstyles.calender}>
                        <Icon name="angle-down" size={15} color={'white'} />
                      </View>
                    </TouchableOpacity>
                    {Platform.OS === 'ios' ? (
                      <DatePicker
                        modal
                        mode="time"
                        open={dateItem.show5}
                        date={dateItem.date}
                        minimumDate={dateItem.date}
                        onConfirm={date => {
                          setWeekDays({
                            ...weekDays,
                            day5: new Date(date),
                          });
                          setDateItem({...dateItem, show5: false});
                          return false;
                        }}
                        onCancel={() => {
                          setDateItem({...dateItem, show5: false});
                        }}
                      />
                    ) : (
                      dateItem.show5 && (
                        <DateTimePicker
                          testID="dateTimePicker"
                          value={dateItem.date}
                          mode={dateItem.mode}
                          is24Hour={false}
                          display="default"
                          onChange={(event, currentDate) => {
                            if (Platform.OS === 'ios') {
                              setWeekDays({
                                ...weekDays,
                                day5: new Date(currentDate),
                              });
                              setDateItem({...dateItem, show5: false});
                              return false;
                            }
                            if (event.type == 'set')
                              setWeekDays({
                                ...weekDays,
                                day5: new Date(currentDate),
                              }),
                                setDateItem({...dateItem, show5: false});
                          }}
                          minimumDate={dateItem.date}
                        />
                      )
                    )}
                  </View>
                </View>
                <View style={mstyles.tr}>
                  <Text style={mstyles.td}>Saturday</Text>
                  <TextInput
                    keyboardType="numeric"
                    value={weekDays.daySlot6.toString()}
                    onChangeText={val =>
                      setWeekDays({...weekDays, daySlot6: val})
                    }
                    // onEndEditing={() => sameSlot2()}
                    style={{
                      borderColor: 'gray',
                      borderWidth: 1,
                      width: 50,
                      paddingVertical: 0,
                      paddingHorizontal: 10,
                      textAlign: 'center',
                    }}
                  />
                  <View style={mstyles.tdRight}>
                    <TouchableOpacity onPress={() => showDatepicker(6)}>
                      <TextInput
                        style={[mstyles.cinputTxt]}
                        selectionColor="#009783"
                        placeholderTextColor="#949494"
                        placeholder="Start Time"
                        value={
                          weekDays.day6
                            .toLocaleString()
                            .substring(11, 16)
                            .split(':')[0] >= 12
                            ? weekDays.day6
                                .toLocaleString()
                                .substring(11, 16)
                                .split(':')[0] > 12
                              ? (
                                  weekDays.day6
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[0] - 12
                                ).toString().length == 1
                                ? '0' +
                                  (
                                    weekDays.day6
                                      .toLocaleString()
                                      .substring(11, 16)
                                      .split(':')[0] - 12
                                  ).toString() +
                                  ':' +
                                  weekDays.day6
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[1] +
                                  ' PM'
                                : weekDays.day6
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[0] -
                                  12 +
                                  ':' +
                                  weekDays.day6
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[1] +
                                  ' PM'
                              : weekDays.day6
                                  .toLocaleString()
                                  .substring(11, 16) + ' PM'
                            : weekDays.day6
                                .toLocaleString()
                                .substring(11, 16)
                                .split(':')[0] == 0
                            ? (
                                parseInt(
                                  weekDays.day6
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[0],
                                ) + 12
                              ).toString() +
                              ':' +
                              weekDays.day6
                                .toLocaleString()
                                .substring(11, 16)
                                .split(':')[1] +
                              ' AM'
                            : weekDays.day6.toLocaleString().substring(11, 16) +
                              ' AM'
                        }
                        editable={false}
                      />
                      <View style={mstyles.calender}>
                        <Icon name="angle-down" size={15} color={'white'} />
                      </View>
                    </TouchableOpacity>
                    {Platform.OS === 'ios' ? (
                      <DatePicker
                        modal
                        mode="time"
                        open={dateItem.show6}
                        date={dateItem.date}
                        minimumDate={dateItem.date}
                        onConfirm={date => {
                          setWeekDays({
                            ...weekDays,
                            day6: new Date(date),
                          });
                          setDateItem({...dateItem, show6: false});
                          // sameTime2(new Date(date));
                          return false;
                        }}
                        onCancel={() => {
                          setDateItem({...dateItem, show6: false});
                        }}
                      />
                    ) : (
                      dateItem.show6 && (
                        <DateTimePicker
                          testID="dateTimePicker"
                          value={dateItem.date}
                          mode={dateItem.mode}
                          is24Hour={false}
                          display="default"
                          onChange={(event, currentDate) => {
                            if (event.type == 'set')
                              setWeekDays({
                                ...weekDays,
                                day6: new Date(currentDate),
                              }),
                                setDateItem({...dateItem, show6: false});
                            // sameTime2(new Date(currentDate));
                          }}
                          minimumDate={dateItem.date}
                        />
                      )
                    )}
                  </View>
                </View>
                <View style={mstyles.tr}>
                  <Text style={mstyles.td}>Sunday</Text>
                  <TextInput
                    keyboardType="numeric"
                    value={weekDays.daySlot7.toString()}
                    onChangeText={val =>
                      setWeekDays({...weekDays, daySlot7: val})
                    }
                    style={{
                      borderColor: 'gray',
                      borderWidth: 1,
                      width: 50,
                      paddingVertical: 0,
                      paddingHorizontal: 10,
                      textAlign: 'center',
                    }}
                  />
                  <View style={mstyles.tdRight}>
                    <TouchableOpacity onPress={() => showDatepicker(7)}>
                      <TextInput
                        style={[mstyles.cinputTxt]}
                        selectionColor="#009783"
                        placeholderTextColor="#949494"
                        placeholder="Start Time"
                        value={
                          weekDays.day7
                            .toLocaleString()
                            .substring(11, 16)
                            .split(':')[0] >= 12
                            ? weekDays.day7
                                .toLocaleString()
                                .substring(11, 16)
                                .split(':')[0] > 12
                              ? (
                                  weekDays.day7
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[0] - 12
                                ).toString().length == 1
                                ? '0' +
                                  (
                                    weekDays.day7
                                      .toLocaleString()
                                      .substring(11, 16)
                                      .split(':')[0] - 12
                                  ).toString() +
                                  ':' +
                                  weekDays.day7
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[1] +
                                  ' PM'
                                : weekDays.day7
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[0] -
                                  12 +
                                  ':' +
                                  weekDays.day7
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[1] +
                                  ' PM'
                              : weekDays.day7
                                  .toLocaleString()
                                  .substring(11, 16) + ' PM'
                            : weekDays.day7
                                .toLocaleString()
                                .substring(11, 16)
                                .split(':')[0] == 0
                            ? (
                                parseInt(
                                  weekDays.day7
                                    .toLocaleString()
                                    .substring(11, 16)
                                    .split(':')[0],
                                ) + 12
                              ).toString() +
                              ':' +
                              weekDays.day7
                                .toLocaleString()
                                .substring(11, 16)
                                .split(':')[1] +
                              ' AM'
                            : weekDays.day7.toLocaleString().substring(11, 16) +
                              ' AM'
                        }
                        editable={false}
                      />
                      <View style={mstyles.calender}>
                        <Icon name="angle-down" size={15} color={'white'} />
                      </View>
                    </TouchableOpacity>
                    {Platform.OS === 'ios' ? (
                      <DatePicker
                        modal
                        mode="time"
                        open={dateItem.show7}
                        date={dateItem.date}
                        minimumDate={dateItem.date}
                        onConfirm={date => {
                          setWeekDays({
                            ...weekDays,
                            day7: new Date(date),
                          });
                          setDateItem({...dateItem, show7: false});
                          return false;
                        }}
                        onCancel={() => {
                          setDateItem({...dateItem, show7: false});
                        }}
                      />
                    ) : (
                      dateItem.show7 && (
                        <DateTimePicker
                          testID="dateTimePicker"
                          value={dateItem.date}
                          mode={dateItem.mode}
                          is24Hour={false}
                          display="default"
                          onChange={(event, currentDate) => {
                            if (Platform.OS === 'ios') {
                              setWeekDays({
                                ...weekDays,
                                day7: new Date(currentDate),
                              });
                              setDateItem({...dateItem, show7: false});
                              return false;
                            }
                            if (event.type == 'set')
                              setWeekDays({
                                ...weekDays,
                                day7: new Date(currentDate),
                              }),
                                setDateItem({...dateItem, show7: false});
                          }}
                          minimumDate={dateItem.date}
                        />
                      )
                    )}
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
          <View style={{flexDirection: 'row', width: w}}>
            <View style={{width: '50%', backgroundColor: Colors.red}}>
              <Button
                title="Cancel"
                color={Platform.OS === 'ios' ? 'white' : Colors.red}
                onPress={() =>
                  navigation.navigate('Configure', {
                    id: route.params.id,
                    name: route.params.name,
                  })
                }
              />
            </View>
            <View style={{width: '50%', backgroundColor: Colors.blue}}>
              <Button
                title="Next"
                color={Platform.OS === 'ios' ? 'white' : Colors.blue}
                onPress={() =>
                  navigation.navigate('UpdateConfigureSlot2', {
                    id: route.params.id,
                    facilityName: route.params.facilityName,
                    rangeName: rangeName,
                    timeStamp: route.params.timeStamp,
                    fromDate: fromDate,
                    toDate: toDate,
                    props: JSON.stringify(weekDays),
                  })
                }
              />
            </View>
          </View>
        </>
      )}
    </>
  );
};

export default UpdateConfigureSlot1;

export const UpdateConfigureSlot2 = ({navigation, route}) => {
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
  const [response, setResponse] = useState({name: '', amount: ''});
  const [dateItem, setDateItem] = useState({
    showDate: null,
    useDate: null,
    mode: 'date',
    show1: false,
    show2: false,
    date: new Date(),
    date1: new Date(),
  });
  const [fromToDate, setFromToDate] = useState({
    fromDate: new Date(),
    toDate: '',
    rangeName: '',
    timeStamp: '',
  });
  const [weekDays, setWeekDays] = useState(JSON.parse(route.params.props));
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);
  const [modalOpened2, setModalOpened2] = useState(false);
  const [day1, setDay1] = useState([]);
  const [day2, setDay2] = useState([]);
  const [day3, setDay3] = useState([]);
  const [day4, setDay4] = useState([]);
  const [day5, setDay5] = useState([]);
  const [day6, setDay6] = useState([]);
  const [day7, setDay7] = useState([]);
  const [dayAmount1, setDayAmount1] = useState([]);
  const [dayAmount2, setDayAmount2] = useState([]);
  const [dayAmount3, setDayAmount3] = useState([]);
  const [dayAmount4, setDayAmount4] = useState([]);
  const [dayAmount5, setDayAmount5] = useState([]);
  const [dayAmount6, setDayAmount6] = useState([]);
  const [dayAmount7, setDayAmount7] = useState([]);
  useEffect(() => {
    setFromToDate({
      fromDate: new Date(route.params.fromDate),
      toDate: new Date(route.params.toDate).setDate(
        new Date(route.params.toDate).getDate() - 1,
      ),
      rangeName: route.params.rangeName,
      timeStamp: route.params.timeStamp,
    });
    var h = weekDays.slotSize.toString();
    Date.prototype.addSeconds = function (seconds) {
      this.setSeconds(this.getSeconds() + seconds);
      return this;
    };

    Date.prototype.addMinutes = function (minutes) {
      this.setMinutes(this.getMinutes() + minutes);
      return this;
    };
    var day1 = [];
    var day2 = [];
    var day3 = [];
    var day4 = [];
    var day5 = [];
    var day6 = [];
    var day7 = [];
    var time1 = new Date(weekDays.day1);
    var time2 = new Date(weekDays.day2);
    var time3 = new Date(weekDays.day3);
    var time4 = new Date(weekDays.day4);
    var time5 = new Date(weekDays.day5);
    var time6 = new Date(weekDays.day6);
    var time7 = new Date(weekDays.day7);
    for (let index = 1; index <= weekDays.daySlot1; index++) {
      day1.push(
        <View key={index} style={{marginRight: 10, marginBottom: 10}}>
          <TextInput
            keyboardType="numeric"
            style={mstyles.cinputTxt}
            value={dayAmount1[index - 1]}
            onChangeText={val => (dayAmount1[index - 1] = val)}
            onEndEditing={() =>
              index == 1 &&
              dayAmount1[0] != undefined &&
              dayAmount1[0] != '' &&
              modalOpened == false
                ? setModalVisible(true)
                : null
            }
          />
          <Text>
            Slot {index}{' '}
            {time1.toLocaleString().substring(11, 16).split(':')[0] >= 12
              ? time1.toLocaleString().substring(11, 16).split(':')[0] > 12
                ? (
                    time1.toLocaleString().substring(11, 16).split(':')[0] - 12
                  ).toString().length == 1
                  ? '0' +
                    (
                      time1.toLocaleString().substring(11, 16).split(':')[0] -
                      12
                    ).toString() +
                    ':' +
                    time1.toLocaleString().substring(11, 16).split(':')[1] +
                    ' PM'
                  : time1.toLocaleString().substring(11, 16).split(':')[0] -
                    12 +
                    ':' +
                    time1.toLocaleString().substring(11, 16).split(':')[1] +
                    ' PM'
                : time1.toLocaleString().substring(11, 16) + ' PM'
              : time1.toLocaleString().substring(11, 16).split(':')[0] == 0
              ? (
                  parseInt(
                    time1.toLocaleString().substring(11, 16).split(':')[0],
                  ) + 12
                ).toString() +
                ':' +
                time1.toLocaleString().substring(11, 16).split(':')[1] +
                ' AM'
              : time1.toLocaleString().substring(11, 16) + ' AM'}
          </Text>
        </View>,
      );
      time1 = time1.addMinutes(parseInt(h * 60));
    }
    for (let index = 1; index <= weekDays.daySlot2; index++) {
      day2.push(
        <View key={index} style={{marginRight: 10, marginBottom: 10}}>
          <TextInput
            keyboardType="numeric"
            style={mstyles.cinputTxt}
            value={dayAmount2[index - 1]}
            onChangeText={val => (dayAmount2[index - 1] = val)}
          />
          <Text>
            Slot {index}{' '}
            {time2.toLocaleString().substring(11, 16).split(':')[0] >= 12
              ? time2.toLocaleString().substring(11, 16).split(':')[0] > 12
                ? (
                    time2.toLocaleString().substring(11, 16).split(':')[0] - 12
                  ).toString().length == 1
                  ? '0' +
                    (
                      time2.toLocaleString().substring(11, 16).split(':')[0] -
                      12
                    ).toString() +
                    ':' +
                    time2.toLocaleString().substring(11, 16).split(':')[1] +
                    ' PM'
                  : time2.toLocaleString().substring(11, 16).split(':')[0] -
                    12 +
                    ':' +
                    time2.toLocaleString().substring(11, 16).split(':')[1] +
                    ' PM'
                : time2.toLocaleString().substring(11, 16) + ' PM'
              : time2.toLocaleString().substring(11, 16).split(':')[0] == 0
              ? (
                  parseInt(
                    time2.toLocaleString().substring(11, 16).split(':')[0],
                  ) + 12
                ).toString() +
                ':' +
                time2.toLocaleString().substring(11, 16).split(':')[1] +
                ' AM'
              : time2.toLocaleString().substring(11, 16) + ' AM'}
          </Text>
        </View>,
      );
      time2 = time2.addMinutes(parseInt(h * 60));
    }
    for (let index = 1; index <= weekDays.daySlot3; index++) {
      day3.push(
        <View key={index} style={{marginRight: 10, marginBottom: 10}}>
          <TextInput
            keyboardType="numeric"
            style={mstyles.cinputTxt}
            value={dayAmount3[index - 1]}
            onChangeText={val => (dayAmount3[index - 1] = val)}
          />
          <Text>
            Slot {index}{' '}
            {time3.toLocaleString().substring(11, 16).split(':')[0] >= 12
              ? time3.toLocaleString().substring(11, 16).split(':')[0] > 12
                ? (
                    time3.toLocaleString().substring(11, 16).split(':')[0] - 12
                  ).toString().length == 1
                  ? '0' +
                    (
                      time3.toLocaleString().substring(11, 16).split(':')[0] -
                      12
                    ).toString() +
                    ':' +
                    time3.toLocaleString().substring(11, 16).split(':')[1] +
                    ' PM'
                  : time3.toLocaleString().substring(11, 16).split(':')[0] -
                    12 +
                    ':' +
                    time3.toLocaleString().substring(11, 16).split(':')[1] +
                    ' PM'
                : time3.toLocaleString().substring(11, 16) + ' PM'
              : time3.toLocaleString().substring(11, 16).split(':')[0] == 0
              ? (
                  parseInt(
                    time3.toLocaleString().substring(11, 16).split(':')[0],
                  ) + 12
                ).toString() +
                ':' +
                time3.toLocaleString().substring(11, 16).split(':')[1] +
                ' AM'
              : time3.toLocaleString().substring(11, 16) + ' AM'}
          </Text>
        </View>,
      );
      time3 = time3.addMinutes(parseInt(h * 60));
    }
    for (let index = 1; index <= weekDays.daySlot4; index++) {
      day4.push(
        <View key={index} style={{marginRight: 10, marginBottom: 10}}>
          <TextInput
            keyboardType="numeric"
            style={mstyles.cinputTxt}
            value={dayAmount4[index - 1]}
            onChangeText={val => (dayAmount4[index - 1] = val)}
          />
          <Text>
            Slot {index}{' '}
            {time4.toLocaleString().substring(11, 16).split(':')[0] >= 12
              ? time4.toLocaleString().substring(11, 16).split(':')[0] > 12
                ? (
                    time4.toLocaleString().substring(11, 16).split(':')[0] - 12
                  ).toString().length == 1
                  ? '0' +
                    (
                      time4.toLocaleString().substring(11, 16).split(':')[0] -
                      12
                    ).toString() +
                    ':' +
                    time4.toLocaleString().substring(11, 16).split(':')[1] +
                    ' PM'
                  : time4.toLocaleString().substring(11, 16).split(':')[0] -
                    12 +
                    ':' +
                    time4.toLocaleString().substring(11, 16).split(':')[1] +
                    ' PM'
                : time4.toLocaleString().substring(11, 16) + ' PM'
              : time4.toLocaleString().substring(11, 16).split(':')[0] == 0
              ? (
                  parseInt(
                    time4.toLocaleString().substring(11, 16).split(':')[0],
                  ) + 12
                ).toString() +
                ':' +
                time4.toLocaleString().substring(11, 16).split(':')[1] +
                ' AM'
              : time4.toLocaleString().substring(11, 16) + ' AM'}
          </Text>
        </View>,
      );
      time4 = time4.addMinutes(parseInt(h * 60));
    }
    for (let index = 1; index <= weekDays.daySlot5; index++) {
      day5.push(
        <View key={index} style={{marginRight: 10, marginBottom: 10}}>
          <TextInput
            keyboardType="numeric"
            style={mstyles.cinputTxt}
            value={dayAmount5[index - 1]}
            onChangeText={val => (dayAmount5[index - 1] = val)}
          />
          <Text>
            Slot {index}{' '}
            {time5.toLocaleString().substring(11, 16).split(':')[0] >= 12
              ? time5.toLocaleString().substring(11, 16).split(':')[0] > 12
                ? (
                    time5.toLocaleString().substring(11, 16).split(':')[0] - 12
                  ).toString().length == 1
                  ? '0' +
                    (
                      time5.toLocaleString().substring(11, 16).split(':')[0] -
                      12
                    ).toString() +
                    ':' +
                    time5.toLocaleString().substring(11, 16).split(':')[1] +
                    ' PM'
                  : time5.toLocaleString().substring(11, 16).split(':')[0] -
                    12 +
                    ':' +
                    time5.toLocaleString().substring(11, 16).split(':')[1] +
                    ' PM'
                : time5.toLocaleString().substring(11, 16) + ' PM'
              : time5.toLocaleString().substring(11, 16).split(':')[0] == 0
              ? (
                  parseInt(
                    time5.toLocaleString().substring(11, 16).split(':')[0],
                  ) + 12
                ).toString() +
                ':' +
                time5.toLocaleString().substring(11, 16).split(':')[1] +
                ' AM'
              : time5.toLocaleString().substring(11, 16) + ' AM'}
          </Text>
        </View>,
      );
      time5 = time5.addMinutes(parseInt(h * 60));
    }
    for (let index = 1; index <= weekDays.daySlot6; index++) {
      day6.push(
        <View key={index} style={{marginRight: 10, marginBottom: 10}}>
          <TextInput
            keyboardType="numeric"
            style={mstyles.cinputTxt}
            value={dayAmount6[index - 1]}
            onChangeText={val => (dayAmount6[index - 1] = val)}
            onEndEditing={() =>
              index == 1 &&
              dayAmount6[0] != undefined &&
              dayAmount6[0] != '' &&
              modalOpened2 == false
                ? setModalVisible2(true)
                : null
            }
          />
          <Text>
            Slot {index}{' '}
            {time6.toLocaleString().substring(11, 16).split(':')[0] >= 12
              ? time6.toLocaleString().substring(11, 16).split(':')[0] > 12
                ? (
                    time6.toLocaleString().substring(11, 16).split(':')[0] - 12
                  ).toString().length == 1
                  ? '0' +
                    (
                      time6.toLocaleString().substring(11, 16).split(':')[0] -
                      12
                    ).toString() +
                    ':' +
                    time6.toLocaleString().substring(11, 16).split(':')[1] +
                    ' PM'
                  : time6.toLocaleString().substring(11, 16).split(':')[0] -
                    12 +
                    ':' +
                    time6.toLocaleString().substring(11, 16).split(':')[1] +
                    ' PM'
                : time6.toLocaleString().substring(11, 16) + ' PM'
              : time6.toLocaleString().substring(11, 16).split(':')[0] == 0
              ? (
                  parseInt(
                    time6.toLocaleString().substring(11, 16).split(':')[0],
                  ) + 12
                ).toString() +
                ':' +
                time6.toLocaleString().substring(11, 16).split(':')[1] +
                ' AM'
              : time6.toLocaleString().substring(11, 16) + ' AM'}
          </Text>
        </View>,
      );
      time6 = time6.addMinutes(parseInt(h * 60));
    }
    for (let index = 1; index <= weekDays.daySlot7; index++) {
      day7.push(
        <View key={index} style={{marginRight: 10, marginBottom: 10}}>
          <TextInput
            keyboardType="numeric"
            style={mstyles.cinputTxt}
            value={dayAmount7[index - 1]}
            onChangeText={val => (dayAmount7[index - 1] = val)}
          />
          <Text>
            Slot {index}{' '}
            {time7.toLocaleString().substring(11, 16).split(':')[0] >= 12
              ? time7.toLocaleString().substring(11, 16).split(':')[0] > 12
                ? (
                    time7.toLocaleString().substring(11, 16).split(':')[0] - 12
                  ).toString().length == 1
                  ? '0' +
                    (
                      time7.toLocaleString().substring(11, 16).split(':')[0] -
                      12
                    ).toString() +
                    ':' +
                    time7.toLocaleString().substring(11, 16).split(':')[1] +
                    ' PM'
                  : time7.toLocaleString().substring(11, 16).split(':')[0] -
                    12 +
                    ':' +
                    time7.toLocaleString().substring(11, 16).split(':')[1] +
                    ' PM'
                : time7.toLocaleString().substring(11, 16) + ' PM'
              : time7.toLocaleString().substring(11, 16).split(':')[0] == 0
              ? (
                  parseInt(
                    time7.toLocaleString().substring(11, 16).split(':')[0],
                  ) + 12
                ).toString() +
                ':' +
                time7.toLocaleString().substring(11, 16).split(':')[1] +
                ' AM'
              : time7.toLocaleString().substring(11, 16) + ' AM'}
          </Text>
        </View>,
      );
      time7 = time7.addMinutes(parseInt(h * 60));
    }
    setDay1(day1);
    setDay2(day2);
    setDay3(day3);
    setDay4(day4);
    setDay5(day5);
    setDay6(day6);
    setDay7(day7);
    setItems({...items, isLoaded: true});
  }, [items.isLoaded]);

  function ResetAmount() {
    setDayAmount1([]);
    setDayAmount2([]);
    setDayAmount3([]);
    setDayAmount4([]);
    setDayAmount5([]);
    setDayAmount6([]);
    setDayAmount7([]);
    setItems({...items, isLoaded: false});
    setModalOpened(false);
    setModalOpened2(false);
  }
  const sameAmount = () => {
    setModalVisible(false);
    setModalOpened(true);
    for (let index = 1; index <= weekDays.daySlot1; index++) {
      dayAmount1[index - 1] = dayAmount1[0];
    }
    for (let index = 1; index <= weekDays.daySlot2; index++) {
      dayAmount2[index - 1] = dayAmount1[0];
    }
    for (let index = 1; index <= weekDays.daySlot3; index++) {
      dayAmount3[index - 1] = dayAmount1[0];
    }
    for (let index = 1; index <= weekDays.daySlot4; index++) {
      dayAmount4[index - 1] = dayAmount1[0];
    }
    for (let index = 1; index <= weekDays.daySlot5; index++) {
      dayAmount5[index - 1] = dayAmount1[0];
    }
    setItems({...items, isLoaded: false});
  };
  const sameAmount2 = () => {
    setModalVisible2(false);
    setModalOpened2(true);
    for (let index = 1; index <= weekDays.daySlot6; index++) {
      dayAmount6[index - 1] = dayAmount6[0];
    }
    for (let index = 1; index <= weekDays.daySlot7; index++) {
      dayAmount7[index - 1] = dayAmount6[0];
    }
    setItems({...items, isLoaded: false});
  };

  const showMode = (currentMode, select) => {
    if (select == 1) {
      setDateItem({...dateItem, show1: true, mode: currentMode});
    } else {
      setDateItem({...dateItem, show2: true, mode: currentMode});
    }
  };

  const showDatepicker = select => {
    showMode('date', select);
  };
  function handleAddSlot() {
    if (
      fromToDate.fromDate == '' &&
      fromToDate.toDate == '' &&
      fromToDate.rangeName == ''
    ) {
      Toast.show('Please fill from date, to date and range name', Toast.SHORT);
    } else {
      setItems({...items, isClicked: true});
      var formData = new FormData();
      formData.append('FacilityId', route.params.id);
      formData.append('Day1', new Date(weekDays.day1).toISOString());
      formData.append('Day2', new Date(weekDays.day2).toISOString());
      formData.append('Day3', new Date(weekDays.day3).toISOString());
      formData.append('Day4', new Date(weekDays.day4).toISOString());
      formData.append('Day5', new Date(weekDays.day5).toISOString());
      formData.append('Day6', new Date(weekDays.day6).toISOString());
      formData.append('Day7', new Date(weekDays.day7).toISOString());
      formData.append('DaySlot1', weekDays.daySlot1);
      formData.append('DaySlot2', weekDays.daySlot2);
      formData.append('DaySlot3', weekDays.daySlot3);
      formData.append('DaySlot4', weekDays.daySlot4);
      formData.append('DaySlot5', weekDays.daySlot5);
      formData.append('DaySlot6', weekDays.daySlot6);
      formData.append('DaySlot7', weekDays.daySlot7);
      formData.append('SlotSize', weekDays.slotSize);
      dayAmount1.map(item => formData.append('DayAmount1', item));
      dayAmount2.map(item => formData.append('DayAmount2', item));
      dayAmount3.map(item => formData.append('DayAmount3', item));
      dayAmount4.map(item => formData.append('DayAmount4', item));
      dayAmount5.map(item => formData.append('DayAmount5', item));
      dayAmount6.map(item => formData.append('DayAmount6', item));
      dayAmount7.map(item => formData.append('DayAmount7', item));
      formData.append('FromDate', new Date(fromToDate.fromDate).toISOString());
      formData.append('ToDate', new Date(fromToDate.toDate).toISOString());
      formData.append('Name', fromToDate.rangeName);
      formData.append('TimeStamp', fromToDate.timeStamp);
      setItems({
        ...items,
        isClicked: true,
        isAuth: true,
      });
      CFormFetch('/Management/UpdateConfigureSlot', token, formData)
        .then(res => {
          console.log('formData', formData);
          console.log('res.status', res.status);
          if (res.status == 200) {
            navigation.navigate('Configure', {
              id: route.params.id,
              name: route.params.facilityName,
              timeStamp: route.params.timeStamp,
            });
          } else if (res.status == 441) {
            setItems({
              ...items,
              isClicked: false,
            });
            res.json().then(result => {
              Toast.show(result, Toast.LONG);
            });
          } else if (res.status == 222) {
            setItems({
              ...items,
              isClicked: false,
            });
            Toast.show(
              'Invalid date range to date must be greater then from date',
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
  }
  function modalView() {
    if (
      dayAmount1 != '' &&
      dayAmount2 != '' &&
      dayAmount3 != '' &&
      dayAmount4 != '' &&
      dayAmount5 != '' &&
      dayAmount6 != '' &&
      dayAmount7 != ''
    ) {
      setModalVisible3(true);
    } else {
      Toast.show('Please fill all prices', Toast.SHORT);
    }
  }
  return (
    <>
      <WaitModal modalVisible={items.isClicked} />
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
              });
            }}
          />
        </View>
      ) : (
        <>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View key={1} style={mstyles.mainContainer}>
              <Title>Monday</Title>
              <View style={mstyles.pcontainer}>{day1}</View>
            </View>
            <View key={2} style={mstyles.mainContainer}>
              <Title>Tuesday</Title>
              <View style={mstyles.pcontainer}>{day2}</View>
            </View>
            <View key={3} style={mstyles.mainContainer}>
              <Title>Wednesday</Title>
              <View style={mstyles.pcontainer}>{day3}</View>
            </View>
            <View key={4} style={mstyles.mainContainer}>
              <Title>Thursday</Title>
              <View style={mstyles.pcontainer}>{day4}</View>
            </View>
            <View key={5} style={mstyles.mainContainer}>
              <Title>Friday</Title>
              <View style={mstyles.pcontainer}>{day5}</View>
            </View>
            <View key={6} style={mstyles.mainContainer}>
              <Title>Saturday</Title>
              <View style={mstyles.pcontainer}>{day6}</View>
            </View>
            <View key={7} style={mstyles.mainContainer}>
              <Title>Sunday</Title>
              <View style={mstyles.pcontainer}>{day7}</View>
            </View>
          </ScrollView>
          <View style={{flexDirection: 'row', width: w}}>
            <View style={{width: '50%', backgroundColor: Colors.red}}>
              <Button
                title="Reset"
                color={Platform.OS === 'ios' ? 'white' : Colors.red}
                onPress={
                  () => ResetAmount()
                  // navigation.navigate('ConfigureSlot1', {
                  //   id: route.params.id,
                  //   name: route.params.name,
                  // })
                }
              />
            </View>
            <View style={{width: '50%', backgroundColor: Colors.blue}}>
              <Button
                title="Next"
                color={Platform.OS === 'ios' ? 'white' : Colors.blue}
                onPress={() => modalView()}
              />
            </View>
          </View>
          <Modal animationType="fade" transparent={true} visible={modalVisible}>
            <SafeAreaView style={{flex: 1}}>
              <Pressable
                style={mstyles.centeredView}
                onPressOut={() => setModalVisible(false)}>
                <Pressable style={mstyles.modalView}>
                  <Text style={mstyles.modalText}>
                    Auto fill booking amount
                  </Text>
                  <Text>
                    Do you want to auto fill this same amount for all slots for
                    rest of the weekdays
                  </Text>
                  <Text>
                    For weekends, you will have to manually enter the amount.
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: 10,
                      marginTop: 15,
                    }}>
                    <Pressable
                      style={[mstyles.button, mstyles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)}>
                      <Text style={styles.textStyle}>No</Text>
                    </Pressable>
                    <Pressable
                      style={[mstyles.button, mstyles.buttonConfirm]}
                      onPress={() => sameAmount()}>
                      <Text style={mstyles.textStyle}>Yes</Text>
                    </Pressable>
                  </View>
                </Pressable>
              </Pressable>
            </SafeAreaView>
          </Modal>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible2}>
            <SafeAreaView style={{flex: 1}}>
              <Pressable
                style={mstyles.centeredView}
                onPressOut={() => setModalVisible2(false)}>
                <Pressable style={mstyles.modalView}>
                  <Text style={mstyles.modalText}>
                    Auto fill booking amount
                  </Text>
                  <Text>
                    Do you want to auto fill this same amount for all slots for
                    rest of the weekends.
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: 10,
                      marginTop: 15,
                    }}>
                    <Pressable
                      style={[mstyles.button, mstyles.buttonClose]}
                      onPress={() => setModalVisible2(!modalVisible2)}>
                      <Text style={styles.textStyle}>No</Text>
                    </Pressable>
                    <Pressable
                      style={[mstyles.button, mstyles.buttonConfirm]}
                      onPress={() => sameAmount2()}>
                      <Text style={mstyles.textStyle}>Yes</Text>
                    </Pressable>
                  </View>
                </Pressable>
              </Pressable>
            </SafeAreaView>
          </Modal>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible3}>
            <SafeAreaView style={{flex: 1}}>
              <Pressable
                style={mstyles.centeredView}
                onPressOut={() => setModalVisible3(false)}>
                <Pressable style={mstyles.modalView}>
                  <Text style={mstyles.modalText}>Save Range</Text>
                  <Text>
                    Select date range for which you want to publish the pricing
                    and also you can name your range
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 20,
                      alignItems: 'center',
                    }}>
                    <Text style={{marginRight: 20}}>From</Text>
                    <TouchableOpacity onPress={() => showDatepicker(1)}>
                      <TextInput
                        style={[
                          mstyles.cinputTxt,
                          {
                            width: 150,
                            paddingVertical: Platform.OS === 'ios' ? 10 : 0,
                          },
                        ]}
                        selectionColor="#009783"
                        placeholderTextColor="#949494"
                        placeholder="From Date"
                        value={
                          fromToDate.fromDate != ''
                            ? new Date(fromToDate.fromDate).toDateString()
                            : null
                        }
                        editable={false}
                      />
                      <View style={mstyles.calender}>
                        <Icon name="calendar" size={15} color={'white'} />
                      </View>
                    </TouchableOpacity>
                  </View>
                  {Platform.OS === 'ios' ? (
                    <DatePicker
                      modal
                      mode="date"
                      open={dateItem.show1}
                      date={dateItem.date}
                      minimumDate={dateItem.date}
                      onConfirm={date => {
                        setFromToDate({
                          ...fromToDate,
                          fromDate: new Date(date),
                        }),
                          setDateItem({...dateItem, show1: false});
                        return false;
                      }}
                      onCancel={() => {
                        setDateItem({...dateItem, show1: false});
                      }}
                    />
                  ) : (
                    dateItem.show1 && (
                      <DateTimePicker
                        style={{width: 200}}
                        testID="dateTimePicker"
                        value={dateItem.date}
                        mode="date"
                        is24Hour={false}
                        display="default"
                        onChange={(event, currentDate) => {
                          if (Platform.OS === 'ios') {
                            setFromToDate({
                              ...fromToDate,
                              fromDate: new Date(currentDate),
                            }),
                              setDateItem({...dateItem, show1: false});
                            return false;
                          }
                          if (event.type == 'set')
                            setFromToDate({
                              ...fromToDate,
                              fromDate: new Date(currentDate),
                            }),
                              setDateItem({...dateItem, show1: false});
                        }}
                        minimumDate={dateItem.date}
                      />
                    )
                  )}
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 20,
                      alignItems: 'center',
                    }}>
                    <Text style={{marginRight: 32}}>To</Text>
                    <TouchableOpacity onPress={() => showDatepicker(2)}>
                      <TextInput
                        style={[
                          mstyles.cinputTxt,
                          {
                            width: 150,
                            paddingVertical: Platform.OS === 'ios' ? 10 : 0,
                          },
                        ]}
                        selectionColor="#009783"
                        placeholderTextColor="#949494"
                        placeholder="To Date"
                        value={
                          fromToDate.toDate != ''
                            ? new Date(fromToDate.toDate).toDateString()
                            : null
                        }
                        editable={false}
                      />
                      <View style={mstyles.calender}>
                        <Icon name="calendar" size={15} color={'white'} />
                      </View>
                    </TouchableOpacity>
                  </View>
                  {Platform.OS === 'ios' ? (
                    <DatePicker
                      modal
                      mode="date"
                      open={dateItem.show2}
                      date={dateItem.date}
                      minimumDate={dateItem.date}
                      onConfirm={date => {
                        setFromToDate({
                          ...fromToDate,
                          toDate: new Date(date),
                        }),
                          setDateItem({...dateItem, show2: false});
                        return false;
                      }}
                      onCancel={() => {
                        setDateItem({...dateItem, show2: false});
                      }}
                    />
                  ) : (
                    dateItem.show2 && (
                      <DateTimePicker
                        style={{width: 200}}
                        testID="dateTimePicker"
                        value={dateItem.date}
                        mode="date"
                        is24Hour={false}
                        display="default"
                        onChange={(event, currentDate) => {
                          if (Platform.OS === 'ios') {
                            setFromToDate({
                              ...fromToDate,
                              toDate: new Date(currentDate),
                            }),
                              setDateItem({...dateItem, show2: false});
                            return false;
                          }
                          if (event.type == 'set')
                            setFromToDate({
                              ...fromToDate,
                              toDate: new Date(currentDate),
                            }),
                              setDateItem({...dateItem, show2: false});
                        }}
                        minimumDate={fromToDate.fromDate}
                      />
                    )
                  )}
                  <View style={{height: 20}} />
                  <Text>Range name (For e.g. March Range)</Text>
                  <TextInput
                    placeholder="Range Name"
                    value={fromToDate.rangeName}
                    style={[
                      mstyles.cinputTxt,
                      {
                        width: 190,
                        marginTop: 10,
                        paddingVertical: Platform.OS === 'ios' ? 10 : 0,
                      },
                    ]}
                    onChangeText={val =>
                      setFromToDate({...fromToDate, rangeName: val})
                    }
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: 10,
                      marginTop: 15,
                    }}>
                    <Pressable
                      style={[mstyles.button, mstyles.buttonClose]}
                      onPress={() => setModalVisible3(!modalVisible3)}>
                      <Text style={styles.textStyle}>Cancel</Text>
                    </Pressable>
                    <Pressable
                      style={[mstyles.button, mstyles.buttonConfirm]}
                      onPress={() => {
                        setModalVisible3(!modalVisible3), handleAddSlot();
                      }}>
                      <Text style={mstyles.textStyle}>Save</Text>
                    </Pressable>
                  </View>
                </Pressable>
              </Pressable>
            </SafeAreaView>
          </Modal>
        </>
      )}
    </>
  );
};

const mstyles = StyleSheet.create({
  mainContainer: {padding: 10, marginHorizontal: '5%'},
  pcontainer: {
    width: w,
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
