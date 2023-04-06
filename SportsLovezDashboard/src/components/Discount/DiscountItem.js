import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Button, Title} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import Colors from '../../settings/Colors';
const DiscountItem = ({item, index, handleEnableDisable}) => {
  const navigation = useNavigation();
  return (
    <View key={index} style={styles.container}>
      <View style={styles.detailContainer}>
        <Title
          style={{color: 'black', fontWeight: 'bold', fontStyle: 'italic'}}>
          {item.name}
        </Title>
        <Text style={{fontWeight: 'bold'}}>
          Percent {item.percent}%, Max ₹ {item.fix}
        </Text>
        <Text>
          From: {new Date(item.validFrom).toDateString()} To:{' '}
          {new Date(item.validTo).toDateString()}
        </Text>
        <Text style={styles.code}>{item.code}</Text>
        <View style={styles.btnContainer}>
          <Button
            style={styles.btn}
            onPress={() =>
              navigation.navigate('AddUpdateDiscount', {id: item.id})
            }
            color={Colors.green}>
            <FontAwesome name="pencil" size={20} />
          </Button>
          {item.isActive ? (
            <Button
              onPress={() => handleEnableDisable(item.id)}
              style={styles.btn}
              color={Colors.green}>
              <FontAwesome name="toggle-on" size={20} />
            </Button>
          ) : (
            <Button
              onPress={() => handleEnableDisable(item.id)}
              style={styles.btn}
              color={Colors.red}>
              <FontAwesome name="toggle-off" size={20} />
            </Button>
          )}
          {item.type === true && (
            <Button
              onPress={() => navigation.navigate('DiscountUser', {id: item.id})}
              style={styles.btn}
              color={Colors.green}>
              <FontAwesome name="users" size={20} />
            </Button>
          )}
          {item.base === true && (
            <Button
              onPress={() =>
                navigation.navigate('DiscountFacility', {id: item.id})
              }
              style={styles.btn}
              color={Colors.green}>
              <FontAwesome name="tasks" size={20} />
            </Button>
          )}
        </View>
      </View>
    </View>
  );
};

export default DiscountItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.red,
    backgroundColor: Colors.red,
    marginTop: 10,
    paddingLeft: 3,
    marginHorizontal: 10,
  },
  percentContainer: {
    marginLeft: 'auto',
    padding: 5,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContainer: {
    borderRadius: 5,
    backgroundColor: 'white',
    marginLeft: 'auto',
    padding: 10,
    paddingVertical: 5,
    width: '100%',
  },
  percentTitle: {
    color: 'white',
    lineHeight: 20,
  },
  percent: {
    color: 'white',
    lineHeight: 15,
    fontSize: 16,
  },
  code: {
    textTransform: 'uppercase',
    borderWidth: 1,
    borderColor: 'black',
    color: 'black',
    borderStyle: 'dashed',
    borderRadius: 5,
    width: 100,
    marginTop: 10,
    padding: 2,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: {
    width: 50,
    marginHorizontal: 5,
  },
});
