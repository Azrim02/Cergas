import React from 'react';
import { Image, ImageBackground, StyleSheet, View, Text } from 'react-native';

import colors from '../config/colors';

function WelcomeScreen(props) {
    return (
        <ImageBackground
            style={styles.background}
            source={{uri:"https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg"}}  
        >
            <View style={styles.logoContainer}>
                <Image source={require('../assets/favicon.png')} style={styles.logo}/>
                <Text style={styles.logoText}>Welcome to Cergas App</Text>
            </View>
            
            
            <View style={styles.loginButton}></View>
            <View style={styles.registerButton}></View>

        </ImageBackground>  

    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    loginButton:{
        width: '100%',
        height: 70,
        backgroundColor: colors.primary,
    },
    registerButton:{
        width: '100%',
        height: 70,
        backgroundColor: colors.secondary,
    },
    logo:{
        width: 100, 
        height: 100,
        position:'absolute',
        top: 70
    },
    logoContainer:{
        justifyContent: 'center',
        alignItems: 'center',
        position:'absolute',
        top: 70,
    },
    logoText:{
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        position:'absolute',
        top: 180
    }
})

export default WelcomeScreen;