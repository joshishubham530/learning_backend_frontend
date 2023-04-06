import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DrawerContent from './DrawerContent';
import Home from '../components/Home/Home';
const Drawer = createDrawerNavigator();
const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      screenOptions={{headerShown: false}}
      drawerContent={props => (
        <DrawerContent {...props} initialRouteName="Home" />
      )}>
      <Drawer.Screen name="Home" component={Home} />
    </Drawer.Navigator>
  );
};
export default DrawerNavigation;
