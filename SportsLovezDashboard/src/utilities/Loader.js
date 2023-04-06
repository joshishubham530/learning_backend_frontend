import * as React from 'react';
import {View, Text, Image, StatusBar, ImageBackground} from 'react-native';
import {BallIndicator} from 'react-native-indicators';
import Colors from '../settings/Colors';
const Loader = () => {
  return (
    <ImageBackground
      source={require('../assets/imgs/background.jpg')}
      style={{height: '100%', width: '100%'}}>
      <StatusBar hidden={false} backgroundColor="#660000" />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-around',
          backgroundColor: 'white',
          width: '100%',
        }}>
        <View
          style={{flex: 0.6, justifyContent: 'center', alignItems: 'center'}}>
          <Image
            style={{width: 200, height: 130}}
            resizeMode="stretch"
            source={require('../assets/imgs/logo.png')}
          />
          <Text
            style={{
              color: 'black',
              marginTop: 10,
              fontSize: 30,
              fontStyle: 'italic',
            }}>
            Sports Manager
          </Text>
          <Text
            style={{
              color: 'black',
              marginTop: 10,
              fontSize: 35,
              textAlign: 'center',
              fontStyle: 'italic',
            }}>
            Manage your ground bookings
          </Text>
        </View>
        <View
          style={{
            flex: 0.15,
            bottom: '10%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <BallIndicator size={25} count={10} color={Colors.red} />
          <Text style={{color: Colors.blue}}>Version 1.0</Text>
        </View>
      </View>
    </ImageBackground>
  );
};
export default Loader;
