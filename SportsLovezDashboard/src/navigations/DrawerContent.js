import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { Avatar, Title, Caption, Drawer, Text } from 'react-native-paper';
import {
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CFetch } from '../settings/APIFetch';
import { AuthContext, UserContext } from '../settings/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../utilities/stylesheet';
import { useFocusEffect } from '@react-navigation/native';
const DrawerContent = props => {
  // const isDrawerOpen = useIsDrawerOpen();
  const { token, fullName, phoneNumber } = useContext(UserContext);
  const { signOut } = useContext(AuthContext);
  const [items, setItems] = useState({
    isEditing: false,
    isReadOnly: false,
    isLoaded: false,
    isInternet: true,
  });
  const [response, setResponse] = useState({
    fullName: '',
    email: '',
    userName: '',
    phoneNumber: '',
    address: '',
    dob: '',
    gender: '',
    profession: '',
  });
  const [showImage, setShowImage] = useState('');
  const getProfile = () => {
    CFetch('/Account2/GetProfileSettings', token, {})
      .then(res => {
        if (res.status == 200) {
          res.json().then(result => {
            setResponse({
              ...response,
              fullName: result.fullName,
              email: result.email,
              phoneNumber: result.phoneNumber,
              userName: result.userName,
              address: result.address,
              dob: result.dob,
              profession: result.profession,
              gender: result.gender,
              referCode: result.referCode,
            });
            if (result.imageUrl != null) {
              setShowImage(result.imageUrl);
            } else {
              setShowImage('');
            }
          });
        } else if (res.status == 400) {
          setData({
            ...data,
            check_textInputChange: false,
            isValidUser: false,
          });
        }
      })
      .catch(error => {
        setItems({
          ...items,
          isInternet: false,
        });
      });
  };
  const [isUpdate, setIsUpdated] = useState();
  async function getIsUpdated() {
    setIsUpdated(await AsyncStorage.getItem('isUpdated'));
  }
  // if (isDrawerOpen == true) {
  //     setTimeout(() => {
  //         getIsUpdated()
  //         if (isUpdate == "true") {
  //             getProfile();
  //             AsyncStorage.setItem("isUpdated", "false")
  //         }
  //     }, 100);
  // }
  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        getIsUpdated();
        if (isUpdate == 'true') {
          getProfile();
          AsyncStorage.setItem('isUpdated', 'false');
        }
      }, 100);
    }, []),
  );
  useEffect(() => {
    getProfile();
  }, [items.isLoaded]);
  const refer = () => (
    <View style={{ display: 'flex', flexDirection: 'row' }}>
      <View style={{ left: -15 }}>
        <Text style={{ color: 'white' }}>Invite your friends</Text>
        <Text style={{ color: 'white' }}>& Get Rs. 100 /-</Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          top: 0,
          bottom: 0,
          position: 'absolute',
          right: -15,
        }}>
        <Icon name="chevron-right" color="white" size={20} />
      </View>
    </View>
  );
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <TouchableWithoutFeedback
              onPress={() => {
                props.navigation.navigate('Profile'),
                  props.navigation.toggleDrawer();
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 15,
                  alignItems: 'center',
                }}>
                {!showImage == '' ? (
                  <Avatar.Image source={{ uri: showImage }} size={50} />
                ) : response.gender == 'Female' ? (
                  <Avatar.Image
                    source={require('../assets/imgs/female.png')}
                    size={50}
                  />
                ) : (
                  <Avatar.Image
                    source={require('../assets/imgs/male.png')}
                    size={50}
                  />
                )}
                <View style={{ marginLeft: 15, flexDirection: 'column' }}>
                  <Title style={styles.title}>
                    {response.fullName != '' ? response.fullName : fullName}
                  </Title>
                  <Caption style={styles.caption}>
                    {response.phoneNumber != ''
                      ? response.phoneNumber
                      : phoneNumber}
                  </Caption>
                </View>
                <Icon
                  name="chevron-right"
                  style={{ position: 'absolute', right: 0 }}
                  size={30}
                  color="black"
                />
              </View>
            </TouchableWithoutFeedback>
            <View style={styles.row}>
              <Text
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#e8e8e8',
                  width: '100%',
                }}
              />
            </View>
            <Drawer.Section>
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="home-outline" color={color} size={size} />
                )}
                label="Home"
                onPress={() => {
                  props.navigation.navigate('Home');
                }}
              />
              {/* <DrawerItem
                                icon={({ color, size }) => (
                                    <Icon name="chat-outline"
                                        color={color}
                                        size={size} />
                                )}
                                label="Chat"
                                onPress={() => { props.navigation.navigate("ChatHistory") }} /> */}
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="gift" color={color} size={size} />
                )}
                label="Discounts"
                onPress={() => {
                  props.navigation.navigate('Discount'),
                    props.navigation.toggleDrawer();
                }}
              />
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="bookmark-outline" color={color} size={size} />
                )}
                label="Booking History"
                onPress={() => {
                  props.navigation.navigate('Bookings'),
                    props.navigation.toggleDrawer();
                }}
              />
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="phone" color={color} size={size} />
                )}
                label="Contact Support"
                onPress={() => {
                  props.navigation.navigate('Help'),
                    props.navigation.toggleDrawer();
                }}
              />
            </Drawer.Section>
          </View>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label="Log Out"
          onPress={() => {
            signOut();
          }}
        />
      </Drawer.Section>
    </View>
  );
};

export default DrawerContent;
