import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import DrawerNavigation from './DrawerNavigation';
import Profile from '../components/Authentication/Profile';
import Help from '../components/Support/Help';
import Bookings from '../components/BookingHistory/Bookings';
import BookingDetail from '../components/BookingHistory/BookingDetail';
import Configure from '../components/Slots/Configure';
import SlotsList from '../components/Slots/SlotsList';
import EditSlot from '../components/Slots/EditSlot';
import ConfigureSlot1, {
  ConfigureSlot2,
} from '../components/Slots/ConfigureSlot';
import DiscountList from '../components/Discount/DiscountList';
import AddUpdateDiscount from '../components/Discount/AddUpdateDiscount';
import DiscountUser from '../components/Discount/DiscountUser';
import DiscountFacility from '../components/Discount/DiscountFacility';
import AddFacility from '../components//Facility/AddFacility';
import UpdateFacility from '../components/Facility/UpdateFacility';
import UpdateConfigureSlot1, {
  UpdateConfigureSlot2,
} from '../components/Slots/UpdateConfigureSlot';
import {useNavigation} from '@react-navigation/native';
import NotificationService from '../Services/NotificationService';

const Stack = createStackNavigator();
const StackNavigation = () => {
  const navigation = useNavigation();

  // Handle Push Notification Screen Route Start //

  useEffect(() => {
    NotificationService(navigation);
  }, []);

  // Handle Push Notifications Screen Route End //

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#990000',
            height: 45,
          },
          headerTintColor: 'white',
        }}>
        <Stack.Screen
          name="DrawerNavigation"
          component={DrawerNavigation}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{headerTitle: 'My Profile'}}
        />
        <Stack.Screen
          name="AddFacility"
          component={AddFacility}
          options={{headerTitle: 'Add Facility'}}
        />
        <Stack.Screen
          name="UpdateFacility"
          component={UpdateFacility}
          options={{headerTitle: 'Update Facility'}}
        />
        <Stack.Screen
          name="Help"
          component={Help}
          options={{headerTitle: 'Help / Support'}}
        />
        <Stack.Screen
          name="Bookings"
          component={Bookings}
          options={{headerTitle: 'Bookings'}}
        />
        <Stack.Screen
          name="BookingDetail"
          component={BookingDetail}
          options={{headerTitle: 'Booking Detail'}}
        />
        <Stack.Screen
          name="Configure"
          component={Configure}
          options={({route}) => ({
            title:
              route.params != undefined ? route.params.name : 'Configured Slot',
          })}
        />
        <Stack.Screen
          name="SlotsList"
          component={SlotsList}
          options={({route}) => ({
            title: route.params != undefined ? route.params.name : 'Slot List',
          })}
        />
        <Stack.Screen
          name="EditSlot"
          component={EditSlot}
          options={{headerTitle: 'Edit Slot'}}
        />
        <Stack.Screen
          name="ConfigureSlot1"
          component={ConfigureSlot1}
          options={{headerTitle: 'Configure Slots (Step 1)'}}
        />
        <Stack.Screen
          name="ConfigureSlot2"
          component={ConfigureSlot2}
          options={{headerTitle: 'Set Booking Amount (Step 2)'}}
        />
        <Stack.Screen
          name="UpdateConfigureSlot1"
          component={UpdateConfigureSlot1}
          options={{headerTitle: 'Configure Slots (Step 1)'}}
        />
        <Stack.Screen
          name="UpdateConfigureSlot2"
          component={UpdateConfigureSlot2}
          options={{headerTitle: 'Set Booking Amount (Step 2)'}}
        />
        <Stack.Screen
          name="Discount"
          component={DiscountList}
          options={{headerTitle: 'Discount & Offers'}}
        />
        <Stack.Screen
          name="AddUpdateDiscount"
          component={AddUpdateDiscount}
          options={{headerTitle: 'Manage Discount'}}
        />
        <Stack.Screen
          name="DiscountUser"
          component={DiscountUser}
          options={{headerTitle: 'Assign User'}}
        />
        <Stack.Screen
          name="DiscountFacility"
          component={DiscountFacility}
          options={{headerTitle: 'Assign Facility'}}
        />
      </Stack.Navigator>
    </>
  );
};

export default StackNavigation;
