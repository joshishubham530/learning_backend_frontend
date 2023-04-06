import React from 'react';
import {View, Text, Button} from 'react-native';
import Colors from '../settings/Colors';
import styles from './stylesheet';
const NoInternet = ({refresh, error}) => {
  return (
    <>
      <View
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        {error ? (
          <Text style={{marginBottom: 10}}>No Internet Connection</Text>
        ) : (
          <Text style={{marginBottom: 10}}>Something went wrong</Text>
        )}
        <Button title="Retry" color={Colors.blue} onPress={refresh} />
      </View>
    </>
  );
};

export default NoInternet;
