import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import LoginRegister from '../components/Authentication/LoginRegister';
import NotificationService from '../Services/NotificationService';
// import Login from '../components/Authentication/Login';
// import Register from '../components/Authentication/Register';
// import ForgetPassword from '../components/Authentication/ForgetPassword';
// import ConfirmAccount from '../components/Authentication/ConfirmAccount';
// import ResetPassword from '../components/Authentication/ResetPassword';
const Stack = createStackNavigator();
const AuthNavigation = () => {
  const navigation = useNavigation();

  // Handle Push Notification Screen Route Start //

  useEffect(() => {
    NotificationService(navigation)
  }, [])

  // Handle Push Notifications Screen Route End //

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {/* <Stack.Screen name="Start" component={Start} /> */}
      <Stack.Screen name="LoginRegiter" component={LoginRegister} />
      {/* <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ConfirmAccount" component={ConfirmAccount} /> */}
    </Stack.Navigator>
  );
};
export default AuthNavigation;
