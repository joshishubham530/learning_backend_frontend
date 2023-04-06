import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {WaitModal} from '../../utilities/PreLoader';
import Colors from '../../settings/Colors';
import {AuthContext, UserContext} from '../../settings/Context';
import {CFetch, CFormFetch} from '../../settings/APIFetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Avatar} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import SearchableDropdown from 'react-native-searchable-dropdown';
import * as ImagePicker from 'react-native-image-picker';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import Toast from 'react-native-simple-toast';
var inputBorder = '#dedede';
const Profile = ({navigation}) => {
  const {signOut} = useContext(AuthContext);
  const {token, userName} = useContext(UserContext);
  const [state, setState] = useState({
    isReadOnly: false,
    isLoaded: false,
    isClicked: true,
    isInternet: true,
    isRefreshing: false,
    isOldPasswordWrong: false,
  });
  const [response, setResponse] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    userName: '',
    currentPassword: '',
    newPassword: '',
    address: '',
    state: '',
    city: '',
    dob: '',
    gender: '',
    role: '',
    img: [],
  });
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [secureTextOld, setSecureTextOld] = useState(true);
  const [secureTextNew, setSecureTextNew] = useState(true);
  const onRefresh = () => {
    setState({...state, isRefreshing: true});
    loadData();
  };
  const [showImage, setShowImage] = useState('');

  const [showDate, setShowDate] = useState(null);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const onChange = (event, selectedDate) => {
    if (event['type'] === 'set') {
      const currentDate = selectedDate;
      setShowDate(currentDate.toDateString());
    } else {
      setShowDate(null);
    }
    setShow(false);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };
  function SelectImage() {
    let options = {maxWidth: 500, maxHeight: 500, quality: 0.5};
    ImagePicker.launchImageLibrary(options, res => {
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      } else {
        console.log(res.assets);
        setResponse({...response, img: res.assets[0]});
        setShowImage(res.assets[0].uri);
      }
    });
  }
  const loadData = () => {
    CFetch('/Account2/GetProfileSettings', token, {})
      .then(res => {
        if (res.status == 200) {
          res.json().then(result => {
            var strToDate = new Date(result.dob);
            setResponse({
              ...response,
              name: result.fullName,
              email: result.email,
              phoneNumber: result.phoneNumber,
              userName: result.userName,
              address: result.address,
              state: result.state,
              city: result.city,
              dob: result.dob,
              gender: result.gender,
              currentPassword: '',
              newPassword: '',
            });
            if (result.imageUrl != null) {
              setShowImage(result.imageUrl);
            } else {
              setShowImage('');
            }
            setShowDate(strToDate.toDateString());
          });
          setState({
            ...state,
            isClicked: false,
            isInternet: true,
            isLoaded: true,
            isReadOnly: false,
            isEditing: false,
            isRefreshing: false,
          });
        } else if (res.status == 403) {
          signOut();
        } else {
          setState({
            ...state,
            isInternet: false,
            isClicked: false,
            isLoaded: true,
            isReadOnly: false,
            isEditing: false,
            isRefreshing: false,
          });
          Toast.show('No Internet Connection.', Toast.SHORT);
        }
        setState({...state, isClicked: false});
      })
      .catch(error => {
        setState({
          ...state,
          isInternet: false,
          isClicked: false,
          isLoaded: true,
          isReadOnly: false,
          isEditing: false,
          isRefreshing: false,
        });
        Toast.show('No Internet Connection.', Toast.SHORT);
      });
  };
  const getStates = () => {
    CFetch('/User/States', token, {})
      .then(res => {
        if (res.status == 200) {
          res.json().then(result => {
            setStates(result);
          });
        } else if (res.status == 403) {
          signOut();
        } else {
          setState({
            ...state,
            isInternet: false,
            isClicked: false,
          });
          Toast.show('No Internet Connection.', Toast.SHORT);
        }
        setState({...state, isClicked: false});
      })
      .catch(error => {
        setState({
          ...state,
          isInternet: false,
          isClicked: false,
        });
        Toast.show('No Internet Connection.', Toast.SHORT);
      });
  };
  useEffect(() => {
    getStates();
    loadData();
  }, []);
  function onChangeState(item) {
    setSelectedCity('');
    if (item == '') {
      setResponse({...response, state: ''});
    } else {
      setResponse({...response, state: item.name});
    }
    if (item != '') {
      var id = item.id;
      CFetch('/User/CitiesByStateId?id=' + id, token, {})
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
  function updateProfileHandler() {
    setState({...state, isOldPasswordWrong: false, isClicked: true});
    var formData = new FormData();
    formData.append('FullName', response.name);
    formData.append('Email', response.email);
    formData.append('PhoneNumber', response.phoneNumber);
    if (response.img.length != 0) {
      formData.append('Image', {
        name: response.img.fileName,
        uri: response.img.uri,
        type: response.img.type,
      });
    }
    formData.append('Address', response.address);
    if (selectedState != '') {
      formData.append('State', selectedState.name);
    }
    if (selectedCity != '') {
      formData.append('City', selectedCity.name);
    }
    if (response.currentPassword != '') {
      formData.append('OldPassword', response.currentPassword);
    }
    if (response.newPassword != '') {
      formData.append('NewPassword', response.newPassword);
    }
    formData.append('Gender', response.gender);
    CFormFetch('/Account2/UpdateProfileSettings', token, formData)
      .then(res => {
        if (res.status == 200) {
          AsyncStorage.setItem('isUpdated', 'true');
          setState({
            ...state,
            isReadOnly: false,
            isLoaded: false,
            isClicked: false,
            isInternet: true,
            isRefreshing: false,
            isOldPasswordWrong: false,
          });
          Toast.show('Profile Updated Successfully');
        } else if (res.status == 402) {
          setState({
            ...state,
            isOldPasswordWrong: true,
          });
        }
      })
      .catch(error => {
        setState({
          ...state,
          isInternet: false,
          isClicked: false,
        });
        Toast.show('No Internet Connection', Toast.SHORT);
      })
      .finally(() => {
        setState({
          ...state,
          isClicked: false,
          isLoaded: true,
        });
      });
  }
  const headerButton = (
    <TouchableOpacity
      onPress={() => {
        signOut(), setState({...state, isClicked: true});
      }}>
      <Icon name="sign-out" style={[styles.icon, {marginLeft: 15}]} />
    </TouchableOpacity>
  );
  return (
    <>
      {/* <HeaderSecondary title="My Profile" button={headerButton} /> */}
      <WaitModal modalVisible={state.isClicked} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        refreshControl={
          <RefreshControl
            refreshing={state.isRefreshing}
            onRefresh={() => onRefresh()}
          />
        }>
        <View style={styles.container}>
          {state.isReadOnly == true ? (
            <View style={styles.profileImageContainer}>
              {showImage == '' ? (
                <Icon style={styles.profileImageIcon} name="user" size={80} />
              ) : (
                <Avatar.Image size={120} source={{uri: showImage}} />
              )}
            </View>
          ) : (
            <View style={styles.profileImageContainer}>
              <TouchableOpacity onPress={() => SelectImage()}>
                {showImage == '' ? (
                  <Icon style={styles.profileImageIcon} name="user" size={80} />
                ) : (
                  <Avatar.Image size={120} source={{uri: showImage}} />
                )}
                <Icon style={styles.camera} name="camera" size={20} />
              </TouchableOpacity>
            </View>
          )}
          {/* {userName == 'Guestlklkgfljlkgflkj@123' ? null : state.isReadOnly ==
            true ? (
            <TouchableOpacity
              onPress={() => setState({...state, isReadOnly: false})}
              style={styles.editBtn}>
              <Icon color={Colors.blue} size={15} name="pencil" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setState({...state, isReadOnly: true})}
              style={styles.editBtn}>
              <Icon color={Colors.blue} size={15} name="close" />
            </TouchableOpacity>
          )} */}
          <View style={styles.profileInfo}>
            <View style={styles.labelInputContainer}>
              <Text style={styles.txtLabel}>Name</Text>
              <TextInput
                placeholder="Name"
                value={response.name}
                style={styles.txtInput}
                placeholderTextColor="#dedede"
                editable={!state.isReadOnly}
                onChangeText={val => setResponse({...response, name: val})}
              />
            </View>
            <View style={styles.labelInputContainer}>
              <Text style={styles.txtLabel}>Email</Text>
              <TextInput
                placeholder="Email"
                value={response.email}
                style={styles.txtInput}
                placeholderTextColor="#dedede"
                editable={!state.isReadOnly}
                onChangeText={val => setResponse({...response, email: val})}
              />
            </View>
            <View style={styles.labelInputContainer}>
              <Text style={styles.txtLabel}>Phone Number</Text>
              <TextInput
                placeholder="Phone Number"
                value={response.phoneNumber}
                style={[styles.txtInput, {backgroundColor: '#c1c1c17d'}]}
                placeholderTextColor="#dedede"
                keyboardType="numeric"
                editable={false}
                onChangeText={val =>
                  setResponse({...response, phoneNumber: val})
                }
              />
            </View>
            <View style={styles.labelInputContainer}>
              <Text style={styles.txtLabel}>Address</Text>
              <TextInput
                placeholder="Address"
                value={response.address}
                style={styles.txtInput}
                placeholderTextColor="#dedede"
                editable={!state.isReadOnly}
                onChangeText={val => setResponse({...response, address: val})}
              />
            </View>
            <ScrollView
              contentContainerStyle={{flexGrow: 1}}
              keyboardShouldPersistTaps="handled"
              horizontal
              scrollEnabled={false}>
              <View style={styles.labelInputContainer}>
                <Text style={styles.txtLabel}>State</Text>
                {!state.isReadOnly ? (
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
                      placeholder: 'State (if you want to change)',
                      placeholderTextColor: '#dedede',
                      underlineColorAndroid: 'transparent',
                      style: [styles.txtInput, {width: '100%'}],
                    }}
                    listProps={{
                      nestedScrollEnabled: true,
                    }}
                  />
                ) : (
                  <TextInput
                    placeholder="State"
                    value={response.state}
                    style={styles.txtInput}
                    placeholderTextColor="#dedede"
                    editable={!state.isReadOnly}
                  />
                )}
              </View>
            </ScrollView>
            <ScrollView
              contentContainerStyle={{flexGrow: 1}}
              keyboardShouldPersistTaps="handled"
              horizontal
              scrollEnabled={false}>
              <View style={styles.labelInputContainer}>
                <Text style={styles.txtLabel}>City</Text>
                {!state.isReadOnly ? (
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
                      placeholder: 'City  (if you want to change)',
                      placeholderTextColor: '#dedede',
                      underlineColorAndroid: 'transparent',
                      style: [styles.txtInput, {width: '100%'}],
                    }}
                    listProps={{
                      nestedScrollEnabled: true,
                    }}
                  />
                ) : (
                  <TextInput
                    placeholder="City"
                    value={response.city}
                    style={styles.txtInput}
                    placeholderTextColor="#dedede"
                    editable={!state.isReadOnly}
                  />
                )}
              </View>
            </ScrollView>
            <View style={styles.labelInputContainer}>
              <Text style={styles.txtLabel}>Gender</Text>
              <Picker
                style={{marginLeft: 10, left: -15}}
                selectedValue={response.gender}
                enabled={!state.isReadOnly}
                mode="dropdown"
                onValueChange={(val, index) =>
                  setResponse({...response, gender: val})
                }>
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
              </Picker>
            </View>
            {/* <View style={styles.labelInputContainer}>
              <Text style={styles.txtLabel}>Current Pin</Text>
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  borderBottomWidth: 1,
                  borderBottomColor: inputBorder,
                }}>
                <SmoothPinCodeInput
                  placeholder={
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 25,
                        opacity: 0.5,
                        backgroundColor: Colors.blue,
                      }}></View>
                  }
                  mask={
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 25,
                        backgroundColor: Colors.blue,
                      }}></View>
                  }
                  editable={!state.isReadOnly}
                  maskDelay={1000}
                  password={true}
                  cellStyle={null}
                  cellStyleFocused={null}
                  value={response.currentPassword}
                  onTextChange={code =>
                    setResponse({...response, currentPassword: code})
                  }
                />
              </View>
            </View>
            {state.isOldPasswordWrong == true ? (
              <View style={[styles.btnContainer, {alignItems: 'flex-start'}]}>
                <TouchableOpacity onPress={() => resendOTPHandler()}>
                  <Text style={{color: 'red'}}>Old pin is wrong</Text>
                </TouchableOpacity>
              </View>
            ) : null} */}
            <View style={styles.labelInputContainer}>
              <Text style={styles.txtLabel}>New Pin</Text>
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  borderBottomWidth: 1,
                  borderBottomColor: inputBorder,
                }}>
                <SmoothPinCodeInput
                  placeholder={
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 25,
                        opacity: 0.5,
                        backgroundColor: Colors.blue,
                      }}></View>
                  }
                  mask={
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 25,
                        backgroundColor: Colors.blue,
                      }}></View>
                  }
                  editable={!state.isReadOnly}
                  maskDelay={1000}
                  password={true}
                  cellStyle={null}
                  cellStyleFocused={null}
                  value={response.newPassword}
                  onTextChange={code =>
                    setResponse({...response, newPassword: code})
                  }
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      {state.isReadOnly == false ? (
        <View style={{backgroundColor: Colors.blue}}>
          <Button
            title="Update"
            color={Platform.OS === 'ios' ? 'white' : Colors.blue}
            onPress={() => updateProfileHandler()}
          />
        </View>
      ) : null}
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  icon: {
    fontSize: 20,
    color: 'white',
    paddingTop: 10,
    paddingBottom: 10,
  },
  container: {
    flex: 1,
    padding: 10,
    borderTopColor: '#dedede',
    borderTopWidth: 4,
    width: '100%',
  },
  profileImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageIcon: {
    backgroundColor: '#dedede',
    width: 120,
    padding: 20,
    textAlign: 'center',
    borderRadius: 500,
    color: 'white',
  },
  camera: {
    backgroundColor: Colors.blue,
    width: 40,
    padding: 10,
    textAlign: 'center',
    borderRadius: 500,
    color: 'white',
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  profileImage: {
    borderRadius: 500,
    width: 120,
    height: 120,
  },
  profileInfo: {
    marginTop: 20,
    marginLeft: 25,
    marginRight: 25,
  },
  editBtn: {
    alignSelf: 'flex-end',
    marginRight: 20,
    padding: 5,
    alignItems: 'center',
    borderBottomColor: Colors.blue,
    borderBottomWidth: 2,
  },
  labelInputContainer: {
    marginBottom: 10,
    width: '100%',
  },
  txtLabel: {
    marginLeft: 2.5,
    color: '#ababab',
  },
  txtInput: {
    backgroundColor: 'transparent',
    color: 'black',
    fontSize: 18,
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: inputBorder,
  },
  showPassword: {
    padding: 15,
    textAlign: 'center',
    borderRadius: 500,
    position: 'absolute',
    right: 0,
    bottom: 5,
  },
});
