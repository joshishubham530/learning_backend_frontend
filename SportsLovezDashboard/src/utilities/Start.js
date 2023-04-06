import * as React from 'react';
import { View, Text, Button, Image, StyleSheet, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import * as Animatable from 'react-native-animatable';
import styles from './stylesheet'
const Start = ({ navigation }) => {
    return (
        <Animatable.View style={styles.container}>
        <ImageBackground source={require('../assets/imgs/background.jpg')} style={styles.headerContainer}>
            <View style={styles.header}>
                <Animatable.Image style={styles.logo} resizeMode="stretch" source={require("../assets/imgs/start.png")} />    
                </View>        
        </ImageBackground>
            <Animatable.View style={styles.startFooter}>
                <Text style={styles.title}>Stay Connected with us</Text>
                <Text style={styles.text}>Sign In with account</Text>
                <View style={styles.button}>
                <TouchableOpacity backgroundColor="./assets/background.jpg" onPress={() => navigation.navigate('Login')}>
                    <LinearGradient colors={["#ff0000", "#990000", "#ff0000"]} style={styles.startBtn}>
                            <Text style={styles.textSign}>Get Started</Text>
                    <Icon style={{marginLeft:5, bottom:-1}} name="chevron-right" color="white" size={20} /> 
                    </LinearGradient>
                </TouchableOpacity>
                </View>
            </Animatable.View>
        </Animatable.View>
    );
}

export default Start