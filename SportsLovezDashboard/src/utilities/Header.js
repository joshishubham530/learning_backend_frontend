import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

const Header = (title) => {
  const navigation = useNavigation();
  return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            navigation.toggleDrawer()
          }}>
          <Icon name="bars" style={styles.icon} />
        </TouchableOpacity>
        <Text numberOfLines={1} style={styles.title}>
          {title.title}
        </Text>
        {title.isShow ?
        <TouchableOpacity onPress={()=>navigation.navigate("AddFacility")}>
          <Icon name="plus" style={styles.icon} />
        </TouchableOpacity>:null}
      </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#990000",
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 2,

    elevation: 10,
  },
  icon: {
    fontSize: 20,
    color: 'white',
    padding: 15,
  },
  title: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    width: '80%',
    textAlign: 'center',
  },
});
