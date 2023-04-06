import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(notification => {
  console.log('askdfjaksd');
  console.log(notification);
});

AppRegistry.registerComponent(appName, () => App);
