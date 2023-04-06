import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext, UserContext} from './src/settings/Context';
import Loader from './src/utilities/Loader';
import CNavigationContainer from './src/navigations/CNavigationContainer';
import {LogBox} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import messaging from '@react-native-firebase/messaging';
import {View, Text} from 'react-native-animatable';

LogBox.ignoreLogs([
  "Material Top Tab Navigator: 'tabBarOptions' is deprecated. Migrate the options to 'screenOptions' instead.",
  'If you want to use Reanimated 2 then go through our installation steps https://docs.swmansion.com/react-native-reanimated/docs/installation',
  'Possible Unhandled Promise Rejection',
]);
const App = () => {
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };
  useEffect(() => {
    requestUserPermission();
  }, []);

  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };
  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          userName: action.userName,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };
  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState,
  );
  const [appUser, setAppUser] = useState({
    token: '',
    userName: '',
    fullName: '',
    phoneNumber: '',
    userRole: '',
  });
  const authContext = React.useMemo(
    () => ({
      signIn: async (userName, userRole, token, fullName, phoneNumber) => {
        let userToken;
        userToken = null;
        try {
          userToken = token;
          setAppUser({
            ...appUser,
            userName: userName,
            userRole: userRole,
            token: token,
            fullName: fullName,
            phoneNumber: phoneNumber,
          });
          await AsyncStorage.setItem('userToken', token);
          await AsyncStorage.setItem('userName', userName);
          await AsyncStorage.setItem('userRole', userRole);
          await AsyncStorage.setItem('fullName', fullName);
          await AsyncStorage.setItem('phoneNumber', phoneNumber);
        } catch (e) {
          console.log(e);
        }
        dispatch({
          type: 'LOGIN',
          id: userName,
          token: userToken,
          isLoading: false,
        });
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('userName');
          await AsyncStorage.removeItem('userRole');
          await AsyncStorage.removeItem('fullName');
          await AsyncStorage.removeItem('phoneNumber');
        } catch (e) {
          console.log(e);
        }
        dispatch({type: 'LOGOUT'});
      },
      signUp: () => {
        dispatch({type: 'REGISTER', token: 'hkljsh'});
      },
    }),
    [],
  );
  let userToken = null;
  let userName = null;
  let userRole = null;
  let fullName = null;
  let phoneNumber = null;
  const GetUser = async () => {
    try {
      userToken = await AsyncStorage.getItem('userToken');
      userName = await AsyncStorage.getItem('userName');
      userRole = await AsyncStorage.getItem('userRole');
      fullName = await AsyncStorage.getItem('fullName');
      phoneNumber = await AsyncStorage.getItem('phoneNumber');
      setAppUser({
        ...appUser,
        userName: userName,
        userRole: userRole,
        token: userToken,
        fullName: fullName,
        phoneNumber: phoneNumber,
      });
    } catch (e) {
      console.log(e);
    }
  };
  React.useEffect(() => {
    SplashScreen.hide();
    GetUser();
    setTimeout(() => {
      dispatch({
        type: 'RETRIEVE_TOKEN',
        token: userToken,
        userName: userName,
        userRole: userRole,
      });
    }, 1000);
  }, [true]);

  if (loginState.isLoading) {
    return <Loader />;
  }

  return (
    <UserContext.Provider value={appUser}>
      <AuthContext.Provider value={authContext}>
        <CNavigationContainer isLoggedIn={loginState.userToken != null} />
      </AuthContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
