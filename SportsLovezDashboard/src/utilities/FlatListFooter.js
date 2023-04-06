import React from 'react'
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import Colors from '../settings/Colors';

const FlatlistFooter = ({isAllLoaded, message, style}) => {
    return (
      <View style={[styles.container, style]}>
        {!isAllLoaded && <ActivityIndicator color={Colors.red} />}
        {isAllLoaded && <Text style={styles.text}>{message}</Text>}
      </View>
    );
}

export default FlatlistFooter

const styles = StyleSheet.create({
    container: {
        marginBottom: 40
    },
    text:{
        textAlign: 'center',
        fontSize: 14,
        color: Colors.red,
    }
})
