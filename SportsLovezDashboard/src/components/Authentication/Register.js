import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import { Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { WaitModal } from '../../utilities/PreLoader';
import Colors from '../../settings/Colors';
import { AuthContext } from '../../settings/Context';
import { CFetch } from '../../settings/APIFetch';
var inputBorder = '#dedede';
const Register = ({ navigation }) => {
  const { signIn } = useContext(AuthContext);
  const [state, setState] = useState({
    isLoaded: false,
    isClicked: false,
    isEmpty: false,
    isExist: false,
  });
  const [response, setResponse] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    newPassword: '',
    confirmPassword: '',
    address: '',
  });
  const [secureTextNew, setSecureTextNew] = useState(true);
  const [secureTextConfirm, setSecureTextConfirm] = useState(true);
  useEffect(() => {
    setState({ ...state, isLoaded: true });
  }, [state.isLoaded]);

  const registerHandler = async () => {
    let FullName = response.name;
    let Email = response.email;
    let PhoneNumber = response.phoneNumber;
    let Password = response.newPassword;
    let ConfirmPassword = response.confirmPassword;
    setState({
      ...state,
      isExist: false,
      isEmpty: false,
      isClicked: true,
      isPasswordMatch: true,
    });
    if (FullName == '' || Email == '' || PhoneNumber == '' || Password == '') {
      setState({
        ...state,
        isEmpty: true,
      });
    } else if (Password == ConfirmPassword) {
      CFetch('/Account2/OwnerRegister', null, { FullName, Email, PhoneNumber, Password })
        .then(res => {
          if (res.status == 200) {
            setState({
              ...state,
              isClicked: false,
            });
            res.json().then(result => {
              navigation.navigate('ConfirmAccount', {
                username: result.userName,
              });
            });
          } else if (res.status == 409) {
            setState({
              ...state,
              isExist: true,
              isClicked: false,
            });
          } else {
            setState({
              ...state,
              isClicked: false,
            });
          }
        })
        .catch(error => {
          setState({
            ...state,
            isClicked: false,
          });
          Toast.show('No Internet Connection', Toast.LONG);
        });
      //await signIn(userName, password);
    } else {
      setState({ ...state, isEmpty: false, isPasswordMatch: false });
    }
  };

  return (
    <>
      <WaitModal modalVisible={state.isClicked} />
      <View style={styles.header} />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.mainContainer}>
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <Title style={styles.title}>New Registration</Title>
            </View>
            {/* <View style={styles.userIconContainer}>
              <Icon style={styles.userIcon} size={50} name="user" />
            </View> */}
            <View style={styles.labelInputContainer}>
              <Text style={styles.txtLabel}>Full Name</Text>
              <TextInput
                placeholder="Full Name"
                value={response.name}
                style={styles.txtInput}
                placeholderTextColor="#dedede"
                onChangeText={val => setResponse({ ...response, name: val })}
              />
            </View>
            <View style={styles.labelInputContainer}>
              <Text style={styles.txtLabel}>Email</Text>
              <TextInput
                placeholder="Email"
                value={response.email}
                style={styles.txtInput}
                placeholderTextColor="#dedede"
                onChangeText={val => setResponse({ ...response, email: val })}
              />
            </View>
            <View style={styles.labelInputContainer}>
              <Text style={styles.txtLabel}>Phone Number</Text>
              <TextInput
                placeholder="Phone Number"
                value={response.phoneNumber}
                style={styles.txtInput}
                placeholderTextColor="#dedede"
                keyboardType="numeric"
                onChangeText={val =>
                  setResponse({ ...response, phoneNumber: val })
                }
              />
            </View>
            <View style={styles.labelInputContainer}>
              <Text style={styles.txtLabel}>New Password</Text>
              <TextInput
                placeholder="New Password"
                value={response.newPassword}
                style={styles.txtInput}
                placeholderTextColor="#dedede"
                secureTextEntry={secureTextNew}
                onChangeText={val =>
                  setResponse({ ...response, newPassword: val })
                }
              />
              <TouchableOpacity
                onPress={() => setSecureTextNew(!secureTextNew)}
                style={styles.showPassword}>
                <Icon
                  name={secureTextNew == true ? 'eye-slash' : 'eye'}
                  color={secureTextNew == true ? '#ababab' : Colors.blue}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.labelInputContainer}>
              <Text style={styles.txtLabel}>Confirm Password</Text>
              <TextInput
                placeholder="Confirm Password"
                value={response.confirmPassword}
                style={styles.txtInput}
                placeholderTextColor="#dedede"
                secureTextEntry={secureTextConfirm}
                onChangeText={val =>
                  setResponse({ ...response, confirmPassword: val })
                }
              />
              <TouchableOpacity
                onPress={() => setSecureTextConfirm(!secureTextConfirm)}
                style={styles.showPassword}>
                <Icon
                  name={secureTextConfirm == true ? 'eye-slash' : 'eye'}
                  color={secureTextConfirm == true ? '#ababab' : Colors.blue}
                />
              </TouchableOpacity>
            </View>
            {state.isExist == true ? (
              <View style={[styles.btnContainer, { alignItems: 'flex-start' }]}>
                <TouchableOpacity onPress={() => resendOTPHandler()}>
                  <Text style={{ color: 'red' }}>Email Already Exist...</Text>
                </TouchableOpacity>
              </View>
            ) : null}
            {state.isEmpty == true ? (
              <View style={[styles.btnContainer, { alignItems: 'flex-start' }]}>
                <TouchableOpacity onPress={() => resendOTPHandler()}>
                  <Text style={{ color: 'red' }}>Please fill all details...</Text>
                </TouchableOpacity>
              </View>
            ) : null}
            {state.isPasswordMatch == false ? (
              <View style={[styles.btnContainer, { alignItems: 'flex-start' }]}>
                <TouchableOpacity onPress={() => resendOTPHandler()}>
                  <Text style={{ color: 'red' }}>Password not matched...</Text>
                </TouchableOpacity>
              </View>
            ) : null}
            <View style={styles.btnContainer}>
              <TouchableOpacity
                onPress={() => registerHandler()}
                style={styles.btn}>
                <Text style={styles.btnText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={{ color: Colors.blue }}>
                  Already have an account? Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default Register;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    borderTopColor: '#dedede',
    height: windowHeight,
    justifyContent: 'center',
  },
  header: {
    backgroundColor: Colors.red,
    width: '100%',
    position: 'absolute',
    height: 150,
    borderBottomLeftRadius: 150,
    borderBottomRightRadius: 150,
  },
  container: {
    justifyContent: 'center',
    borderRadius: 10,
    marginLeft: 25,
    marginRight: 25,
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 50,
    paddingTop: 40,
    elevation: 10,
  },
  titleContainer: {
    marginBottom: 30,
  },
  title: {
    textAlign: 'center',
    color: Colors.red,
    fontSize: 28,
  },
  userIconContainer: {
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userIcon: {
    backgroundColor: '#dedede',
    width: 90,
    padding: 20,
    textAlign: 'center',
    borderRadius: 500,
    color: 'white',
  },
  labelInputContainer: {
    marginBottom: 10,
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
  btnContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  btn: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: Colors.blue,
    width: 200,
    borderRadius: 5,
  },
  btnText: {
    color: 'white',
  },
});
