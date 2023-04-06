import React from 'react'
import { Modal, View, StyleSheet, Pressable, SafeAreaView } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons'
import Colors from '../settings/Colors'

const PickerModal = ({ Component, visible, setVisible }) => {
    return (
        <Modal animationType='fade' visible={visible} onRequestClose={() => setVisible(false)} transparent>
            <SafeAreaView style={{ flex: 1 }}>
                <Pressable onPress={() => setVisible(false)} style={styles.mainContainer}>
                    <Pressable style={styles.container}>
                        <Pressable style={styles.closeBtn} onPress={() => setVisible(false)}>
                            <MaterialCommunityIcons name="close" size={20} />
                        </Pressable>
                        <Component />
                    </Pressable>
                </Pressable>
            </SafeAreaView>
        </Modal>
    )
}

export default PickerModal
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.transparentBlack,
        height: '100%',
        width: '100%',
        padding: 50,
        // alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999999999
    },
    container: {
        borderRadius: 5,
        height: '90%',
        backgroundColor: 'white',
    },
    closeBtn: {
        marginLeft: 'auto',
        marginRight: 10,
        marginTop: 10,
        padding: 5,
    }
})