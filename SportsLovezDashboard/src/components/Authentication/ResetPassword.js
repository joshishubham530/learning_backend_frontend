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
var inputBorder = '#dedede';
const Register = ({navigation, route}) => {
  const {signIn} = useContext(AuthContext);
  const [state, setState] = useState({
    isReadOnly: true,
    isLoaded: false,
    isClicked: false,
    isPasswordMatch: true,
    isResent: false,
    isValidOtp: true,
  });
  const [response, setResponse] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
    otp: '',
  });
  const [secureTextNew, setSecureTextNew] = useState(true);
  const [secureTextConfirm, setSecureTextConfirm] = useState(true);
  useEffect(() => {
    setResponse({...response, email: route.params.username});
    setState({...state, isLoaded: true, isSent: true});
    Toast.show('Password reset otp sent to your email', Toast.LONG);
  }, [state.isLoaded]);

  const resendOTPHandler = () => {
    let val = response.email;
    setState({
      ...state,
      isValidOtp: true,
      isPasswordMatch: true,
      isClicked: true,
      isResent: false,
      isEmpty: false,
    });
    CFetch('/Account2/ResendOtp?username=' + val, null, {})
      .then(res => {
        if (res.status == 200) {
          setState({
            ...state,
            isResent: true,
            isValidOtp: true,
            isClicked: false,
            isEmpty: false,
          });
        } else if (res.status == 400) {
          setState({
            ...state,
            isClicked: false,
            isEmpty: false,
          });
        }
      })
      .catch(error => {
        setState({
          ...state,
          isClicked: false,
          isEmpty: false,
          isPasswordMatch: true,
        });
        Toast.show('No Internet Connecttion', Toast.LONG);
      });
  };
  const passwordResetHandler = async () => {
    let Email = response.email;
    let Password = response.newPassword;
    let ConfirmPassword = response.confirmPassword;
    let otp = response.otp;
    setState({
      ...state,
      isValidOtp: true,
      isClicked: true,
      isEmpty: false,
      isPasswordMatch: true,
    });
    if (otp == '' || Password == '' || ConfirmPassword == '') {
      setState({
        ...state,
        isEmpty: true,
        isClicked: false,
        isPasswordMatch: true,
      });
    } else if (Password == ConfirmPassword) {
      CFetch(
        '/Account2/ResetPassword?UserName=' +
          Email +
          '&NewPassword=' +
          Password +
          '&Otp=' +
          otp,
        null,
        {},
      )
        .then(res => {
          if (res.status == 200) {
            Toast.show('Password Reset Success...', Toast.SHORT);
            setTimeout(() => {
              navigation.navigate('Login');
            }, 500);
          } else if (res.status == 402) {
            setState({
              ...state,
              isValidOtp: false,
              isClicked: false,
              isPasswordMatch: true,
            });
          } else if (res.status == 406) {
            setState({
              ...state,
              isClicked: false,
              isValidOtp: true,
              isPasswordMatch: true,
            });
            Toast.show('OTP Expired, Resend otp and try again', Toast.LONG);
          }
        })
        .catch(error => {
          setState({
            ...state,
            isClicked: false,
            isEmpty: false,
            isPasswordMatch: true,
          });
          Toast.show('No Internet Connecttion', Toast.LONG);
        });
    } else {
      setState({...state, isPasswordMatch: false, isEmpty: false});
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
              <Title style={styles.title}>Reset Password</Title>
            </View>
            {/* <View style={styles.userIconContainer}>
              <Icon style={styles.userIcon} size={50} name="user" />
            </View> */}
            <View style={styles.labelInputContainer}>
              <Text style={styles.txtLabel}>Enter OTP</Text>
              <TextInput
                placeholder="OTP"
                value={response.otp}
                style={styles.txtInput}
                placeholderTextColor="#dedede"
                keyboardType="numeric"
                onChangeText={val => setResponse({...response, otp: val})}
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
                  setResponse({...response, newPassword: val})
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
                  setResponse({...response, confirmPassword: val})
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
            <View style={[styles.btnContainer, {alignItems: 'flex-end'}]}>
              <TouchableOpacity onPress={() => resendOTPHandler()}>
                <Text style={{color: Colors.blue}}>Resend OTP</Text>
              </TouchableOpacity>
            </View>
            {state.isResent == true ? (
              <View style={[styles.btnContainer, {alignItems: 'flex-start'}]}>
                <TouchableOpacity onPress={() => resendOTPHandler()}>
                  <Text style={{color: 'green'}}>
                    OTP resent to your email ID
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
            {state.isEmpty == true ? (
              <View style={[styles.btnContainer, {alignItems: 'flex-start'}]}>
                <TouchableOpacity onPress={() => resendOTPHandler()}>
                  <Text style={{color: 'red'}}>Please fill all fields...</Text>
                </TouchableOpacity>
              </View>
            ) : null}
            {state.isPasswordMatch == false ? (
              <View style={[styles.btnContainer, {alignItems: 'flex-start'}]}>
                <TouchableOpacity onPress={() => resendOTPHandler()}>
                  <Text style={{color: 'red'}}>Password not matched...</Text>
                </TouchableOpacity>
              </View>
            ) : null}
            {state.isValidOtp == false ? (
              <View style={[styles.btnContainer, {alignItems: 'flex-start'}]}>
                <TouchableOpacity onPress={() => resendOTPHandler()}>
                  <Text style={{color: 'red'}}>
                    Please enter correct otp...
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
            <View style={styles.btnContainer}>
              <TouchableOpacity
                onPress={() => passwordResetHandler()}
                style={styles.btn}>
                <Text style={styles.btnText}>Reset Password</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={{color: Colors.blue}}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default Register;

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
    padding: 20,
    paddingTop: 50,
    paddingBottom: 50,
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
