import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
const Message = ({message, Icon, height, loading, color}) => {
  return (
    <View
      style={[styles.container, {height: height != undefined ? height : null}]}>
      {loading === true ? (
        <ActivityIndicator color={'red'} size={16} style={{padding: 5}} />
      ) : (
        <View style={styles.row}>
          {Icon && <Icon />}
          <Text style={{color: color ? color : 'red'}}>{message}</Text>
        </View>
      )}
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
