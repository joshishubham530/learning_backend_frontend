import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import { Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { WaitModal } from '../../utilities/PreLoader';
import Colors from '../../settings/Colors';
import { AuthContext } from '../../settings/Context';
import { CFetch } from '../../settings/APIFetch';
var inputBorder = '#dedede';
const Login = ({ navigation }) => {
  const { signIn } = useContext(AuthContext);
  const [state, setState] = useState({
    isReadOnly: true,
    isLoaded: false,
    isEmpty: false,
    isClicked: false,
  });
  const [response, setResponse] = useState({ email: '' });
  useEffect(() => {
    setState({ ...state, isLoaded: true });
  }, [state.isLoaded]);

  const forgetPasswordHandler = () => {
    let userName = response.email;
    setState({
      ...state,
      isClicked: true,
      isEmpty: false,
    });
    if (userName == '') {
      setState({
        ...state,
        isClicked: false,
        isEmpty: true,
      });
    } else {
      CFetch('/Account2/GeneratePasswordResetToken?username=' + userName, null, {})
        .then(res => {
          if (res.status == 200) {
            setState({
              ...state,
              isClicked: false,
            });
            navigation.navigate('ResetPassword', { username: userName });
          } else if (res.status == 406) {
            setState({
              ...state,
              isClicked: false,
            });
            navigation.navigate('ConfirmAccount', { username: userName });
          } else if (res.status == 400) {
            setState({
              ...state,
              isClicked: false,
              isEmpty: false,
            });
            Toast.show('Please enter valid email Id', Toast.SHORT);
          }
        })
        .catch(error => {
          setState({
            ...state,
            isClicked: false,
            isEmpty: false,
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
            <View style={styles.titleContainer}>
              <Title style={styles.title}>Forget Password</Title>
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
                onChangeText={val => setResponse({ ...response, email: val })}
              />
            </View>
            {state.isEmpty == true ? (
              <View style={[styles.btnContainer, { alignItems: 'flex-start' }]}>
                <TouchableOpacity onPress={() => resendOTPHandler()}>
                  <Text style={{ color: 'red' }}>Please enter your email...</Text>
                </TouchableOpacity>
              </View>
            ) : null}
            <View style={styles.btnContainer}>
              <TouchableOpacity
                onPress={() => forgetPasswordHandler()}
                style={styles.btn}>
                <Text style={styles.btnText}>Forget Password</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={{ color: Colors.blue }}>
                  Know your password? Sign In
                </Text>
              </TouchableOpacity>
            </View>
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
