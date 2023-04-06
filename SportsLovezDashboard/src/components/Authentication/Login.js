import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import {Title} from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {WaitModal} from '../../utilities/PreLoader';
import Colors from '../../settings/Colors';
import {AuthContext} from '../../settings/Context';
import {CFetch} from '../../settings/APIFetch';
import AsyncStorage from '@react-native-async-storage/async-storage';

var inputBorder = '#dedede';
const Login = ({navigation}) => {
  const {signIn} = useContext(AuthContext);
  const [state, setState] = useState({
    isLoaded: false,
    isClicked: false,
    isEmpty: false,
    isValidDetail: true,
  });
  const [response, setResponse] = useState({email: '', currentPassword: ''});
  const [secureText, setSecureText] = useState(true);
  useEffect(() => {
    setState({...state, isLoaded: true});
  }, [state.isLoaded]);

  const loginHandler = async (userName, password) => {
    if (userName == '' || password == '') {
      setState({
        ...state,
        isEmpty: true,
        isValidDetail: true,
        isValidUser: true,
      });
    } else {
      setState({
        ...state,
        isEmpty: false,
        isClicked: true,
        isValidDetail: true,
        isValidUser: true,
      });
      var DeviceToken = await AsyncStorage.getItem('DeviceToken');
      CFetch('/Account2/Login', null, {
        UserName: userName,
        Password: password,
        OwnerDeviceToken: DeviceToken,
      })
        .then(res => {
          if (res.status == 200) {
            res.json().then(async result => {
              if (result.role[0] == 'Owner') {
                await signIn(
                  result.userName,
                  result.role[0],
                  result.token,
                  result.fullName,
                  result.phoneNumber,
                );
              } else {
                setState({
                  ...state,
                  isValidUser: false,
                });
              }
            });
          } else if (res.status == 400) {
            setState({
              ...state,
              isValidDetail: false,
              isEmpty: false,
              isClicked: false,
            });
          } else if (res.status == 443) {
            setState({
              ...state,
              isValidDetail: true,
              isEmpty: false,
              isClicked: false,
            });
            Toast.show(
              'Your account is locked, contact to administration',
              Toast.LONG,
            );
          } else if (res.status == 406) {
            setState({
              ...state,
              isClicked: false,
            });
            navigation.navigate('ConfirmAccount', {username: userName});
          } else {
            setState({
              ...state,
              isClicked: false,
            });
            Toast.show('Something went wrong, try again later', Toast.SHORT);
          }
        })
        .catch(error => {
          setState({
            ...state,
            isClicked: false,
            isEmpty: false,
            isValidDetail: true,
          });
          Toast.show('No Internet Connecttion', Toast.LONG);
        });
    }
  };

  return (
    <>
      <WaitModal modalVisible={state.isClicked} />
      <View style={styles.header} />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.mainContainer}>
          <View style={styles.container}>
            <View style={styles.innerContainer}>
              <View style={styles.titleContainer}>
                <Title style={styles.title}>User Login</Title>
              </View>
              <View style={styles.userIconContainer}>
                <Icon style={styles.userIcon} size={50} name="user" />
              </View>
              <View style={styles.labelInputContainer}>
                <Text style={styles.txtLabel}>Email</Text>
                <TextInput
                  placeholder="Email"
                  value={response.email}
                  style={styles.txtInput}
                  placeholderTextColor="#dedede"
                  onChangeText={val => setResponse({...response, email: val})}
                />
              </View>
              <View style={styles.labelInputContainer}>
                <Text style={styles.txtLabel}>Password</Text>
                <TextInput
                  placeholder="Password"
                  value={response.currentPassword}
                  style={styles.txtInput}
                  placeholderTextColor="#dedede"
                  secureTextEntry={secureText}
                  onChangeText={val =>
                    setResponse({...response, currentPassword: val})
                  }
                />
                <TouchableOpacity
                  onPress={() => setSecureText(!secureText)}
                  style={styles.showPassword}>
                  <Icon
                    name={secureText == true ? 'eye-slash' : 'eye'}
                    color={secureText == true ? '#ababab' : Colors.blue}
                  />
                </TouchableOpacity>
              </View>
              <View style={[styles.btnContainer, {alignItems: 'flex-end'}]}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgetPassword')}>
                  <Text style={{color: Colors.blue}}>Forget Password</Text>
                </TouchableOpacity>
              </View>
              {state.isValidDetail == false ? (
                <View style={[styles.btnContainer, {alignItems: 'flex-start'}]}>
                  <TouchableOpacity onPress={() => resendOTPHandler()}>
                    <Text style={{color: 'red'}}>
                      Please enter valid email or password
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              {state.isValidUser == false ? (
                <View style={[styles.btnContainer, {alignItems: 'flex-start'}]}>
                  <TouchableOpacity onPress={() => resendOTPHandler()}>
                    <Text style={{color: 'red'}}>
                      You are not a valid user...
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              {state.isEmpty == true ? (
                <View style={[styles.btnContainer, {alignItems: 'flex-start'}]}>
                  <TouchableOpacity onPress={() => resendOTPHandler()}>
                    <Text style={{color: 'red'}}>
                      Please fill all details...
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              <View style={styles.btnContainer}>
                <TouchableOpacity
                  onPress={() =>
                    loginHandler(response.email, response.currentPassword)
                  }
                  style={styles.btn}>
                  <Text style={styles.btnText}>Sign In</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.btnContainer}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Register')}>
                  <Text style={{color: Colors.blue}}>
                    Don't have an account? Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* <View style={[styles.btnContainer, { width: '100%' }]}>
              <TouchableOpacity style={styles.guestBtn} onPress={() => loginHandler("Guestlklkgfljlkgflkj@123", "Guestlklkgfljlkgflkj@123", true)} disabled={state.isClicked}>
                <Text style={styles.guestText}>Continue as a Guest</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    borderTopColor: '#dedede',
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
    marginTop: '20%',
    marginBottom: '10%',
    borderRadius: 10,
    marginLeft: 25,
    marginRight: 25,
    backgroundColor: 'white',
    paddingBottom: 20,
    elevation: 10,
  },
  innerContainer: {
    padding: 20,
  },
  titleContainer: {
    marginBottom: 20,
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
    color: '#949393',
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
  guestBtn: {
    backgroundColor: Colors.red,
    height: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  guestText: {color: 'white', padding: 5},
});
