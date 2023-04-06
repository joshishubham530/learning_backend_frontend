import React from 'react';
import {StatusBar, SafeAreaView} from 'react-native';
import StackNavigation from './StackNavigation';
import AuthNavigation from './AuthNavigation';
import {NavigationContainer} from '@react-navigation/native';

const CNavigationContainer = ({isLoggedIn}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <NavigationContainer>
        <StatusBar hidden={false} backgroundColor="#660000" />
        {isLoggedIn ? <StackNavigation /> : <AuthNavigation />}
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default CNavigationContainer;
