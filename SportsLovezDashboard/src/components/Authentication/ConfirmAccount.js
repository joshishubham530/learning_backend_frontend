import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Toast from 'react-native-simple-toast';
import { Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { WaitModal } from '../../utilities/PreLoader';
import Colors from '../../settings/Colors';
import { AuthContext } from '../../settings/Context'
import { CFetch } from '../../settings/APIFetch'
var inputBorder = "#dedede";
const Login = ({ navigation, route }) => {
  const { signIn } = useContext(AuthContext);
  const [state, setState] = useState({
    isLoaded: false,
    isClicked: false,
    isValidOtp: true,
    isEmpty: true,
    isResent: false
  })
  const [response, setResponse] = useState({ username: null, otp: null });
  useEffect(() => {
    setResponse({ ...response, username: route.params.username });
    setState({ ...state, isLoaded: true })
    Toast.show("Account confirmation otp sent to your email", Toast.LONG)
  }, [state.isLoaded]);

  const resendOTPHandler = () => {
    let val = response.username;
    setState({
      ...state,
      isValidOtp: true,
      isClicked: false,
      isResent: false,
      isEmpty: false,
    });
    CFetch("/Account2/ResendOtp?username=" + val, null, {}).then((res) => {
      if (res.status == 200) {
        setState({
          ...state,
          isResent: true,
          isValidOtp: true,
          isEmpty: false,
        });
      }
      else {
        setState({
          ...state,
          isWentWrong: true,
        });
        Toast.show("something went wrong try again...", Toast.LONG)
      }
    }).catch((error) => {
      setState({
        ...state,
        isClicked: false,
        isValidOtp: true,
        isResent: false,
        isEmpty: false,
      })
      Toast.show("No Internet Connection", Toast.LONG)
    });
  }
  const confirmAccountHandler = () => {
    let userName = response.username;
    let otp = response.otp;
    setState({
      ...state,
      isClicked: true,
      isValidOtp: true,
      isResent: false,
      isEmpty: false,
    })
    if (otp == '') {
      setState({
        ...state,
        isEmpty: true,
        isValidOtp: true,
        isResent: false,
        isClicked: false,
      })
      Toast.show("Please Enter OTP", Toast.SHORT)
    }
    else {
      CFetch("/Account2/ConfirmEmailOrPhone?username=" + userName + "&Otp=" + otp, null, {}).then((res) => {
        if (res.status == 200) {
          Toast.show("Account Confirmation Success", Toast.SHORT);
          res.json().then(async (result) => {
            if (result.role[0] == "Owner") {
              await signIn(result.userName, result.role[0], result.token, result.fullName, result.phoneNumber);
            }
            else {
              setState({
                ...state,
                isValidUser: false,
              });
            }
          })
        }
        else if (res.status == 402) {
          setState({
            ...state,
            isClicked: false,
            isValidOtp: false,
            isResent: false,
          })
        }
        else if (res.status == 406) {
          setState({
            ...state,
            isClicked: false,
            isValidOtp: true,
            isPasswordMatch: true,
          })
          Toast.show("OTP Expired, Resend otp and try again", Toast.LONG)
        }
        else {
          setState({
            ...state,
            isWentWrong: true,
          })
          Toast.show("Something went wrong", Toast.LONG)
        }
      }).catch((error) => {
        setState({
          ...state,
          isClicked: false,
          isValidOtp: true,
          isResent: false,
          isEmpty: false,
        })
        Toast.show("No Internet Connection", Toast.LONG)
      });
    }
  }
  return (
    <>
      <WaitModal modalVisible={state.isClicked} />
      <View style={styles.header} />
      <ScrollView keyboardShouldPersistTaps='handled'>
        <View style={styles.mainContainer}>
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <Title style={styles.title}>Confirm Account</Title>
            </View>
            <View style={styles.userIconContainer}>
              <Icon style={styles.userIcon} size={50} name="user" />
            </View>
            <View style={styles.labelInputContainer}>
              <Text style={styles.txtLabel}>Enter OTP</Text>
              <TextInput placeholder="OTP" value={response.otp} style={styles.txtInput} placeholderTextColor="#dedede"
                keyboardType="numeric" onChangeText={(val) => setResponse({ ...response, otp: val })} />
            </View>

            <View style={[styles.btnContainer, { alignItems: 'flex-end' }]}>
              <TouchableOpacity onPress={() => resendOTPHandler()}>
                <Text style={{ color: Colors.blue }}>
                  Resend OTP
                </Text>
              </TouchableOpacity>
            </View>
            {state.isResent == true ?
              <View style={[styles.btnContainer, { alignItems: 'flex-start' }]}>
                <TouchableOpacity onPress={() => resendOTPHandler()}>
                  <Text style={{ color: "green" }}>
                    OTP resent to your email ID
                  </Text>
                </TouchableOpacity>
              </View> : null}
            {state.isValidOtp == false ?
              <View style={[styles.btnContainer, { alignItems: 'flex-start' }]}>
                <TouchableOpacity onPress={() => resendOTPHandler()}>
                  <Text style={{ color: "red" }}>
                    Please enter valid otp...
                  </Text>
                </TouchableOpacity>
              </View> : null}
            <View style={styles.btnContainer}>
              <TouchableOpacity onPress={() => confirmAccountHandler()} style={styles.btn}>
                <Text style={styles.btnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

export default Login;


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    borderTopColor: '#dedede',
    minHeight: '100%',
    height: '100%'
  },
  header: {
    backgroundColor: Colors.red,
    width: '100%',
    position: 'absolute',
    height: 150,
    borderBottomLeftRadius: 150,
    borderBottomRightRadius: 150
  },
  container: {
    justifyContent: 'center',
    marginTop: "10%",
    marginBottom: "10%",
    borderRadius: 10,
    marginLeft: 25,
    marginRight: 25,
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 50,
    elevation: 10,
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    color: Colors.red,
    fontSize: 28
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
    color: "#ababab",
  },
  txtInput: {
    backgroundColor: "transparent",
    color: "black",
    fontSize: 18,
    width: "100%",
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
    borderRadius: 5
  },
  btnText: {
    color: 'white',
  }
});