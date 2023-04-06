import * as React from 'react';
import { View, Modal, SafeAreaView } from 'react-native';
import { SkypeIndicator, UIActivityIndicator } from 'react-native-indicators';
import styles from './stylesheet';
import Colors from '../settings/Colors';
import LinearGradient from 'react-native-linear-gradient';

const PreLoader = () => {
  return (
    <View style={styles.container}>
      <SkypeIndicator size={30} count={10} color={Colors.red} />
    </View>
  );
};
export default PreLoader;
export const PreLoaderBtn = () => {
  return (
    <View style={styles.btn}>
      <LinearGradient
        style={styles.signIn}
        colors={['#66a3ff', '#66a3ee', '#66a3ff']}>
        <UIActivityIndicator color="white" size={25} />
      </LinearGradient>
    </View>
  );
};
export const WaitModal = ({ modalVisible }) => {
  return (
    <Modal
      animationType={modalVisible ? 'none' : 'fade'}
      transparent={true}
      visible={modalVisible}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={[styles.container, { backgroundColor: '#0a0a0a6b' }]}>
          <UIActivityIndicator size={30} count={10} color={'white'} />
        </View>
      </SafeAreaView>
    </Modal>
  );
};
