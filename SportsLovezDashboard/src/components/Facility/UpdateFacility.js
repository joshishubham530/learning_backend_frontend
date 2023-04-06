import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import styles from '../../utilities/stylesheet';
import {Picker} from '@react-native-picker/picker';
import {UserContext} from '../../settings/Context';
import {CFetch, CFormFetch} from '../../settings/APIFetch';
import PreLoader, {WaitModal} from '../../utilities/PreLoader';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import Colors from '../../settings/Colors';
import {UIActivityIndicator} from 'react-native-indicators';
import {RadioButton} from 'react-native-paper';
import SearchableDropdown from 'react-native-searchable-dropdown';
import NoInternet from '../../utilities/NoInternet';
import GetLocation from 'react-native-get-location';
import Toast from 'react-native-simple-toast';

const UpdateFacility = ({navigation, route}) => {
  const {token, userName} = useContext(UserContext);
  const [items, setItems] = useState({
    isEditing: false,
    isClicked: false,
    isReadOnly: false,
    isError: false,
    isLoaded: false,
    isInternet: true,
    isAuth: true,
  });
  const [waiting, setWaiting] = useState(false);
  const [isInternet, setIsInternet] = useState(true);
  const [isError, setIsError] = useState(false);
  const [response, setResponse] = useState({
    name: '',
    address: '',
    location: '',
    sports: '',
    numofSlots: '',
    startTime: '',
    netType: '',
    facility: '',
    fullName: '',
    phoneNumber: '',
    about: '',
    perSlot: '',
    state: '',
    city: '',
    isSlotCheck: false,
    isDay: false,
    amount: '',
    isWeekDay: false,
    weekDayAmount: '',
    isMonthly: false,
    mAmount: '',
    is3Monthly: false,
    m3Amount: '',
    is6Monthly: false,
    m6Amount: '',
  });
  const [sports, setSports] = useState('');
  const [FacilityType, setFacilityType] = useState([]);
  const [FacilityCategory, setFacilityCategory] = useState([]);
  const [img, setImg] = useState([]);
  const [newImg, setNewImg] = useState([]);
  const [deleteImage, setDeleteImage] = useState([]);

  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const loadData = () => {
    img.forEach(item => {
      var i = img.indexOf(item);
      if (i > -1) {
        img.splice(i);
      }
    });
    newImg.forEach(item => {
      var i = newImg.indexOf(item);
      if (i > -1) {
        newImg.splice(i);
      }
    });
    deleteImage.forEach(item => {
      var i = deleteImage.indexOf(item);
      if (i > -1) {
        deleteImage.splice(i);
      }
    });
    CFetch('/Management/GetFacilityTypeCategory', token, {})
      .then(res => {
        if (res.status == 200) {
          res.json().then(result => {
            setFacilityType(result.facilityTypes);
            setFacilityCategory(result.facilityCategories);
          });
        }
      })
      .catch(error => {
        setItems({
          ...items,
          isInternet: false,
        });
      });
    CFetch('/Management/GetFacilityById?id=' + route.params.id, token, {})
      .then(res => {
        if (res.status == 200) {
          res.json().then(result => {
            setTimeout(() => {
              setStates(result.states);
              setCities(result.cities);
              setResponse({
                ...response,
                name: result.facility.name,
                facility: result.facility.facilityType,
                sports: result.facility.sports,
                numofSlots: result.facility.numberofSlots,
                startTime: result.facility.startTime,
                perSlot: result.facility.perSlot,
                about: result.facility.about,
                amount: result.facility.amount,
                address: result.facility.address,
                location: result.facility.location,
                fullName: result.facility.contactPerson,
                phoneNumber: result.facility.contactNumber,
                netType: result.facility.netType,
                state: result.facility.state,
                city: result.facility.city,
                isDay: result.facility.isDay,
                isWeekDay: result.facility.isWeekDay,
                weekDayAmount: result.facility.weekDayAmount,
                isMonthly: result.facility.isMonthly,
                mAmount: result.facility.mAmount,
                is3Monthly: result.facility.is3Monthly,
                m3Amount: result.facility.m3Amount,
                is6Monthly: result.facility.is6Monthly,
                m6Amount: result.facility.m6Amount,
              });
              setSports(result.facility.sports);
              if (result.facility.imageUrl != null) {
                var newArray = [];
                result.facility.imageUrl.forEach(element => {
                  newArray.push({uri: element});
                });
                setImg(newArray);
              }
              setSelectedState(
                states.find(element => element.name == result.facility.state),
              );
              setSelectedCity(
                states.find(element => element.name == result.facility.city),
              );
            }, 10);
            setTimeout(() => {
              setItems({...items, isLoaded: true, isInternet: true});
            }, 10);
          });
        } else if (res.status == 403) {
          signOut();
        } else {
          setItems({
            ...items,
            isInternet: true,
            isError: true,
          });
          setIsError(true);
          Toast.show('Something went wrong, try again.', Toast.SHORT);
        }
      })
      .catch(error => {
        setItems({
          ...items,
          isInternet: false,
        });
        setIsInternet(false);
        Toast.show('No Internet Connection.', Toast.SHORT);
      });
  };

  const refresh = () => {
    setIsInternet(true);
    setIsError(false);
    setItems({
      ...items,
      isLoaded: false,
      isInternet: true,
      isError: false,
    }),
      loadData();
  };
  useEffect(() => {
    loadData();
  }, []);
  function onChangeFacility(val) {
    val == 'Net'
      ? setResponse({...response, facility: val, sports: 'Cricket'})
      : setResponse({...response, facility: val, sports: ''});
  }
  function onChangeState(item) {
    setSelectedCity('');
    if (item == '') {
      setResponse({...response, state: ''});
    } else {
      setResponse({...response, state: item.name});
    }
    if (item != '') {
      var id = item.id;
      CFetch('/Management/CitiesByStateId?id=' + id, token, {})
        .then(res => {
          if (res.status == 200) {
            res.json().then(result => {
              setCities(result);
            });
          } else {
            Toast.show('Something went wrong', Toast.SHORT);
          }
          setItems({...items, isLoaded: true});
        })
        .catch(error => {
          setItems({
            ...items,
            isInternet: false,
          });
          Toast.show('No Internet Connection', Toast.SHORT);
        });
    } else {
      setCities([]);
      setResponse({...response, city: ''});
    }
  }
  function handleUpdateFacility() {
    console.log(
      response.name,
      response.fullName,
      response.location,
      response.sports,
    );
    if (
      !response.name ||
      !response.fullName ||
      !response.location ||
      !response.sports
    ) {
      Toast.show('Please fill all mandatory fields');
      return false;
    }
    if (response.isDay && !response.amount) {
      Toast.show('Please fill day amount');
      return false;
    }
    if (response.isWeekDay && !response.weekDayAmount) {
      Toast.show('Please fill Week End Day amount');
      return false;
    }
    if (response.isMonthly && !response.mAmount) {
      Toast.show('Please fill monthly amount');
      return false;
    }
    if (response.is3Monthly && !response.m3Amount) {
      Toast.show('Please fill 3 monthly amount');
      return false;
    }
    if (response.is6Monthly && !response.m6Amount) {
      Toast.show('Please fill 6 monthly amount');
      return false;
    }
    var formData = new FormData();
    formData.append('Id', route.params.id);
    formData.append('Name', response.name);
    formData.append('Amount', response.amount);
    formData.append('State', response.state);
    formData.append('City', response.city);
    formData.append('Location', response.location);
    if (newImg.length != 0) {
      newImg.map(item => formData.append(`Image`, item));
    }
    if (deleteImage.length != 0) {
      deleteImage.map(item => formData.append(`DeleteImage`, item));
    }
    formData.append('ContactPerson', response.fullName);
    formData.append('ContactNumber', response.phoneNumber);
    // formData.append("FacilityType", response.facility)
    // formData.append("Sports", response.sports)
    formData.append('About', response.about);
    if (response.facility != 'Academy') {
      formData.append('IsDay', response.isDay);
      formData.append('IsWeekDay', response.isWeekDay);
      formData.append('WeekDayAmount', response.weekDayAmount);
      if (response.sports != 'Cricket') {
        formData.append('IsMonthly', response.isMonthly);
        formData.append('MAmount', response.mAmount);
        formData.append('Is3Monthly', response.is3Monthly);
        formData.append('M3Amount', response.m3Amount);
        formData.append('Is6Monthly', response.is6Monthly);
        formData.append('M6Amount', response.m6Amount);
      }
      if (
        response.isMonthly == false &&
        response.is3Monthly == false &&
        response.is6Monthly == false
      ) {
        formData.append('IsSlotCheck', response.isSlotCheck);
      }
    }
    if (response.facility == 'Academy') {
      formData.append('IsDay', response.isDay);
      formData.append('IsMonthly', response.isMonthly);
      formData.append('MAmount', response.mAmount);
      formData.append('Is3Monthly', response.is3Monthly);
      formData.append('M3Amount', response.m3Amount);
      formData.append('Is6Monthly', response.is6Monthly);
      formData.append('M6Amount', response.m6Amount);
    }
    if (response.facility == 'Net') {
      formData.append('NetType', response.netType);
      formData.append('IsMonthly', response.isMonthly);
      formData.append('MAmount', response.mAmount);
      formData.append('Is3Monthly', response.is3Monthly);
      formData.append('M3Amount', response.m3Amount);
      formData.append('Is6Monthly', response.is6Monthly);
      formData.append('M6Amount', response.m6Amount);
    }
    setItems({
      ...items,
      isAuth: true,
      isClicked: true,
    });
    CFormFetch('/Management/UpdateFacility', token, formData)
      .then(res => {
        if (res.status == 200) {
          navigation.navigate('Home');
        } else if (res.status == 403) {
          setItems({
            ...items,
            isAuth: false,
            isClicked: false,
          });
        } else {
          setItems({
            ...items,
            isClicked: false,
          });
          Toast.show('Something went wrong, try again', Toast.SHORT);
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

  function SelectImage() {
    MultipleImagePicker.openPicker({
      compressQuality: 50,
      minCompressSize: 300,
      maxSize: 10,
      multiple: true,
    }).then(res => {
      var array = [...newImg];
      res.map(item =>
        array.push({
          name: item.fileName,
          uri: 'file://' + item.realPath,
          type: item.mime,
        }),
      );
      setNewImg(array);
    });
  }
  function handleRemoveImage(item) {
    var newArray = [...img];
    var i = newArray.indexOf(item);
    if (i > -1) {
      newArray.splice(i, 1);
    }
    setImg(newArray);
    var ind = item.uri.indexOf('ImageFiles');
    deleteImage.push(item.uri.substring(ind + 11));
  }
  function handleRemoveNewImage(item) {
    var newArray = [...newImg];
    var i = newArray.indexOf(item);
    if (i > -1) {
      newArray.splice(i, 1);
    }
    setNewImg(newArray);
  }
  const requestPermission = async () => {
    try {
      setWaiting(true);
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
        .then(location => {
          setResponse({
            ...response,
            location: location.latitude + ',' + location.longitude,
          });
        })
        .finally(() => {
          setWaiting(false);
        });
    } catch (err) {
      console.warn(err);
    }
  };
  const getCurrentLocation = () => {
    if (response.location === '' || response.location === null) {
      requestPermission();
    } else {
      setResponse({...response, location: ''});
    }
  };
  return (
    <>
      <WaitModal modalVisible={waiting} />
      {!items.isLoaded && items.isInternet ? (
        <PreLoader />
      ) : !isInternet || isError ? (
        <NoInternet
          refresh={refresh}
          error={isInternet == false ? true : isError ? false : null}
        />
      ) : (
        <>
          <View style={styles.container}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled={true}>
              <View style={{padding: 10, alignItems: 'stretch'}}>
                {!items.isAuth ? (
                  <Text style={{color: 'red'}}>
                    You are not authorized person...
                  </Text>
                ) : null}
                <View style={styles.input}>
                  <TextInput
                    style={styles.inputField}
                    selectionColor="#009783"
                    placeholderTextColor="#949494"
                    placeholder="Name*"
                    value={response.name}
                    onChangeText={val => setResponse({...response, name: val})}
                  />
                </View>
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{flexGrow: 1}}
                  horizontal
                  scrollEnabled={false}>
                  <View style={styles.input}>
                    <SearchableDropdown
                      selectedItems={selectedState}
                      onItemSelect={item => {
                        setSelectedState(item), onChangeState(item);
                      }}
                      containerStyle={{
                        padding: 5,
                        width: '100%',
                      }}
                      itemStyle={{
                        padding: 10,
                        marginTop: 2,
                        backgroundColor: 'transparent',
                        width: '100%',
                      }}
                      itemTextStyle={{color: '#222'}}
                      itemsContainerStyle={{maxHeight: 140}}
                      items={states}
                      resetValue={false}
                      textInputProps={{
                        placeholder: 'State  (if you want to change)',
                        underlineColorAndroid: 'transparent',
                        style: [styles.inputField, {width: '100%'}],
                      }}
                      listProps={{
                        nestedScrollEnabled: true,
                      }}
                    />
                  </View>
                </ScrollView>
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{flexGrow: 1}}
                  horizontal
                  scrollEnabled={false}>
                  <View style={styles.input}>
                    <SearchableDropdown
                      selectedItems={selectedCity}
                      onItemSelect={item => {
                        setSelectedCity(item),
                          setResponse({...response, city: item.name});
                      }}
                      containerStyle={{
                        padding: 5,
                        width: '100%',
                      }}
                      itemStyle={{
                        padding: 10,
                        marginTop: 2,
                        backgroundColor: 'transparent',
                        width: '100%',
                      }}
                      itemTextStyle={{color: '#222'}}
                      itemsContainerStyle={{maxHeight: 140}}
                      items={cities}
                      resetValue={false}
                      textInputProps={{
                        placeholder: 'City (if you want to change)',
                        underlineColorAndroid: 'transparent',
                        style: [styles.inputField, {width: '100%'}],
                        editable: true,
                      }}
                      listProps={{
                        nestedScrollEnabled: true,
                      }}
                    />
                  </View>
                </ScrollView>
                <View style={styles.input}>
                  <TextInput
                    editable={false}
                    style={[styles.inputField, {color: Colors.blue}]}
                    selectionColor="#009783"
                    placeholderTextColor="#949494"
                    placeholder="Current Location*"
                    value={
                      response.location != '' && response.location != null
                        ? 'Your Location'
                        : ''
                    }
                    onChangeText={val =>
                      setResponse({...response, location: val})
                    }
                  />
                  <TouchableOpacity
                    onPress={getCurrentLocation}
                    style={{
                      position: 'absolute',
                      right: 20,
                      top: '20%',
                      padding: 5,
                    }}>
                    {response.location === '' || response.location === null ? (
                      <Icon name="map-marker" size={20} color={Colors.blue} />
                    ) : (
                      <Icon name="close" size={20} color={Colors.red} />
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.input}>
                  <Picker
                    style={{marginLeft: 10, left: -15}}
                    selectedValue={response.facility}
                    mode="dropdown"
                    onValueChange={(val, index) => onChangeFacility(val)}>
                    <Picker.Item label="Select Facility*" value="" />
                    {FacilityType.map(item => (
                      <Picker.Item
                        label={item.name}
                        value={item.name}
                        key={FacilityType.indexOf(item)}
                      />
                    ))}
                  </Picker>
                </View>
                {response.facility == 'Net' ? (
                  <View style={styles.input}>
                    <Picker
                      style={{marginLeft: 10, left: -15, color: 'black'}}
                      selectedValue={response.netType}
                      mode="dropdown"
                      onValueChange={(val, index) => {
                        setResponse({...response, netType: val});
                      }}>
                      <Picker.Item label="Net Type" value="" />
                      <Picker.Item label="Cemented" value="Cemented" />
                      <Picker.Item label="Turf" value="Turf" />
                    </Picker>
                  </View>
                ) : null}
                <View style={styles.input}>
                  <Picker
                    style={{marginLeft: 10, left: -15}}
                    enabled={response.facility != 'Net'}
                    selectedValue={sports}
                    mode="dropdown"
                    itemStyle={{}}
                    onValueChange={(val, index) =>
                      setResponse({...response, sports: val})
                    }>
                    <Picker.Item label="Select Sports*" value="" />
                    {FacilityCategory.map(item => (
                      <Picker.Item
                        label={item.name}
                        value={item.name}
                        key={FacilityCategory.indexOf(item)}
                      />
                    ))}
                  </Picker>
                </View>
                <View style={styles.input}>
                  <TextInput
                    style={styles.inputField}
                    value={response.fullName}
                    selectionColor="#009783"
                    placeholderTextColor="#949494"
                    placeholder="Contact Person*"
                    onChangeText={val =>
                      setResponse({...response, fullName: val})
                    }
                  />
                </View>
                <View style={styles.input}>
                  <TextInput
                    style={styles.inputField}
                    value={response.phoneNumber}
                    selectionColor="#009783"
                    placeholderTextColor="#949494"
                    placeholder="Contact Number*"
                    onChangeText={val =>
                      setResponse({...response, phoneNumber: val})
                    }
                  />
                </View>
                <View style={styles.input}>
                  <TextInput
                    style={[
                      styles.inputField,
                      {height: 120, textAlignVertical: 'top'},
                    ]}
                    selectionColor="#009783"
                    placeholderTextColor="#949494"
                    multiline
                    numberOfLines={5}
                    placeholder="About*"
                    value={response.about}
                    onChangeText={val => setResponse({...response, about: val})}
                  />
                </View>
                <View style={{marginLeft: 10}}>
                  {response.sports != 'Cricket' ||
                  response.facility != 'Ground' ? (
                    <>
                      <Text>
                        Full Day Based{' '}
                        {response.facility != 'Academy' && ' (Mon - Fri)'}
                      </Text>
                      <RadioButton.Group
                        disabledStyle={{color: 'red'}}
                        onValueChange={val =>
                          setResponse({...response, isDay: val})
                        }
                        value={response.isDay}>
                        <View style={{flexDirection: 'row'}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <RadioButton.Android
                              value={true}
                              color={Colors.blue}
                            />
                            <Text>Yes</Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <RadioButton.Android
                              value={false}
                              color={Colors.blue}
                            />
                            <Text>No</Text>
                          </View>
                        </View>
                      </RadioButton.Group>
                      <View style={styles.input}>
                        <TextInput
                          style={styles.inputField}
                          value={response.amount}
                          keyboardType="number-pad"
                          selectionColor="#009783"
                          placeholderTextColor="#949494"
                          editable={response.isDay}
                          placeholder="Amount*"
                          onChangeText={val =>
                            setResponse({...response, amount: val})
                          }
                        />
                      </View>
                      {response.facility != 'Academy' && (
                        <>
                          <Text>Week End Day Based (Sat-Sun)</Text>
                          <RadioButton.Group
                            disabledStyle={{color: 'red'}}
                            onValueChange={val =>
                              setResponse({...response, isWeekDay: val})
                            }
                            value={response.isWeekDay}>
                            <View style={{flexDirection: 'row'}}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <RadioButton.Android
                                  value={true}
                                  color={Colors.blue}
                                />
                                <Text>Yes</Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <RadioButton.Android
                                  value={false}
                                  color={Colors.blue}
                                />
                                <Text>No</Text>
                              </View>
                            </View>
                          </RadioButton.Group>
                          <View style={styles.input}>
                            <TextInput
                              style={styles.inputField}
                              value={response.weekDayAmount}
                              keyboardType="number-pad"
                              selectionColor="#009783"
                              placeholderTextColor="#949494"
                              editable={response.isWeekDay}
                              placeholder="Week End Day Amount*"
                              onChangeText={val =>
                                setResponse({...response, weekDayAmount: val})
                              }
                            />
                          </View>
                        </>
                      )}
                      <Text>Monthly Based</Text>
                      <RadioButton.Group
                        disabledStyle={{color: 'red'}}
                        onValueChange={val =>
                          setResponse({...response, isMonthly: val})
                        }
                        value={response.isMonthly}>
                        <View style={{flexDirection: 'row'}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <RadioButton.Android
                              value={true}
                              color={Colors.blue}
                            />
                            <Text>Yes</Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <RadioButton.Android
                              value={false}
                              color={Colors.blue}
                            />
                            <Text>No</Text>
                          </View>
                        </View>
                      </RadioButton.Group>
                      <View style={styles.input}>
                        <TextInput
                          style={styles.inputField}
                          value={response.mAmount}
                          keyboardType="number-pad"
                          selectionColor="#009783"
                          placeholderTextColor="#949494"
                          editable={response.isMonthly}
                          placeholder="Amount*"
                          onChangeText={val =>
                            setResponse({...response, mAmount: val})
                          }
                        />
                      </View>
                      <Text>3 Month Based</Text>
                      <RadioButton.Group
                        disabledStyle={{color: 'red'}}
                        onValueChange={val =>
                          setResponse({...response, is3Monthly: val})
                        }
                        value={response.is3Monthly}>
                        <View style={{flexDirection: 'row'}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <RadioButton.Android
                              value={true}
                              color={Colors.blue}
                            />
                            <Text>Yes</Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <RadioButton.Android
                              value={false}
                              color={Colors.blue}
                            />
                            <Text>No</Text>
                          </View>
                        </View>
                      </RadioButton.Group>
                      <View style={styles.input}>
                        <TextInput
                          style={styles.inputField}
                          value={response.m3Amount}
                          keyboardType="number-pad"
                          selectionColor="#009783"
                          placeholderTextColor="#949494"
                          editable={response.is3Monthly}
                          placeholder="Amount*"
                          onChangeText={val =>
                            setResponse({...response, m3Amount: val})
                          }
                        />
                      </View>
                      <Text>6 Month Based</Text>
                      <RadioButton.Group
                        disabledStyle={{color: 'red'}}
                        onValueChange={val =>
                          setResponse({...response, is6Monthly: val})
                        }
                        value={response.is6Monthly}>
                        <View style={{flexDirection: 'row'}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <RadioButton.Android
                              value={true}
                              color={Colors.blue}
                            />
                            <Text>Yes</Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <RadioButton.Android
                              value={false}
                              color={Colors.blue}
                            />
                            <Text>No</Text>
                          </View>
                        </View>
                      </RadioButton.Group>
                      <View style={styles.input}>
                        <TextInput
                          style={styles.inputField}
                          value={response.m6Amount}
                          keyboardType="number-pad"
                          selectionColor="#009783"
                          placeholderTextColor="#949494"
                          editable={response.is6Monthly}
                          placeholder="Amount*"
                          onChangeText={val =>
                            setResponse({...response, m6Amount: val})
                          }
                        />
                      </View>
                    </>
                  ) : (
                    <>
                      <Text>Full Day Based (Mon - Fri)</Text>
                      <RadioButton.Group
                        disabledStyle={{color: 'red'}}
                        onValueChange={val =>
                          setResponse({...response, isDay: val})
                        }
                        value={response.isDay}>
                        <View style={{flexDirection: 'row'}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <RadioButton.Android
                              value={true}
                              color={Colors.blue}
                            />
                            <Text>Yes</Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <RadioButton.Android
                              value={false}
                              color={Colors.blue}
                            />
                            <Text>No</Text>
                          </View>
                        </View>
                      </RadioButton.Group>
                      <View style={styles.input}>
                        <TextInput
                          style={styles.inputField}
                          value={response.amount}
                          keyboardType="number-pad"
                          selectionColor="#009783"
                          placeholderTextColor="#949494"
                          editable={response.isDay}
                          placeholder="Amount*"
                          onChangeText={val =>
                            setResponse({...response, amount: val})
                          }
                        />
                      </View>
                      <Text>Week End Day Based (Sat-Sun)</Text>
                      <RadioButton.Group
                        disabledStyle={{color: 'red'}}
                        onValueChange={val =>
                          setResponse({...response, isWeekDay: val})
                        }
                        value={response.isWeekDay}>
                        <View style={{flexDirection: 'row'}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <RadioButton.Android
                              value={true}
                              color={Colors.blue}
                            />
                            <Text>Yes</Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <RadioButton.Android
                              value={false}
                              color={Colors.blue}
                            />
                            <Text>No</Text>
                          </View>
                        </View>
                      </RadioButton.Group>
                      <View style={styles.input}>
                        <TextInput
                          style={styles.inputField}
                          value={response.weekDayAmount}
                          selectionColor="#009783"
                          placeholderTextColor="#949494"
                          editable={response.isWeekDay}
                          placeholder="Week End Day Amount*"
                          onChangeText={val =>
                            setResponse({...response, weekDayAmount: val})
                          }
                        />
                      </View>
                    </>
                  )}
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginTop: 10,
                    flexWrap: 'wrap',
                  }}>
                  {img.map(item => (
                    <View key={img.indexOf(item)} style={{marginRight: 10}}>
                      <Image
                        style={{height: 100, width: 100, marginBottom: 10}}
                        source={{uri: item.uri}}
                      />
                      <TouchableOpacity
                        style={{
                          position: 'absolute',
                          right: 5,
                          backgroundColor: 'white',
                          padding: 2,
                          top: 5,
                        }}
                        onPress={() => handleRemoveImage(item)}>
                        <Icon name="close" color="black" />
                      </TouchableOpacity>
                    </View>
                  ))}
                  {newImg.map(item => (
                    <View key={newImg.indexOf(item)} style={{marginRight: 10}}>
                      <Image
                        style={{height: 100, width: 100, marginBottom: 10}}
                        source={{uri: item.uri}}
                      />
                      <TouchableOpacity
                        style={{
                          position: 'absolute',
                          right: 5,
                          backgroundColor: 'white',
                          padding: 2,
                          top: 5,
                        }}
                        onPress={() => handleRemoveNewImage(item)}>
                        <Icon name="close" color="black" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                <View style={{margin: 10}}>
                  <TouchableOpacity onPress={() => SelectImage()}>
                    <Text style={{color: 'blue'}}>Add Image</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
          {items.isClicked == false ? (
            <View
              style={{
                justifyContent: 'flex-end',
                backgroundColor: Colors.blue,
              }}>
              <Button
                title="Save"
                color={Platform.OS === 'ios' ? 'white' : Colors.blue}
                onPress={() => handleUpdateFacility()}
              />
            </View>
          ) : (
            <View style={{justifyContent: 'flex-end'}}>
              <View
                style={{
                  backgroundColor: Colors.blue,
                  padding: 16.5,
                  elevation: 5,
                }}>
                <UIActivityIndicator color="white" size={22} />
              </View>
            </View>
          )}
        </>
      )}
    </>
  );
};
export default UpdateFacility;
