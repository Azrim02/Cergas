import React, { useEffect, useRef } from 'react';
import { Image, ImageBackground, StyleSheet, View, Text, Animated } from 'react-native';

import colors from '../config/colors';
import AppButton from '../components/AppButton';




function Welcome(props) {
    const fadeAnim = useRef(new Animated.Value(0)).current; // Start fully transparent
    const zoomAnim = useRef(new Animated.Value(0.8)).current; // Start slightly zoomed-in
    const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);

    useEffect(() => {
        Animated.sequence([
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000, // 2 seconds fade-in
            useNativeDriver: true,
        }),
        Animated.timing(zoomAnim, {
            toValue: 1,
            duration: 2000, // 2 seconds zoom-in
            useNativeDriver: true,
        }),
        ]).start();
    }, []);

    return (
        <AnimatedImageBackground
            style={[styles.background, { opacity: fadeAnim, transform: [{ scale: zoomAnim }] }]}
            source={{uri:"https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg"}}  
            blurRadius={10}
        >
            <View style={styles.logoContainer}>
                <Image source={require('../assets/favicon.png')} style={styles.logo}/>
                <Text style={styles.logoText}>Welcome to Cergas App</Text>
            </View>
            
            <View style={styles.buttonContainer}>
                <AppButton title="Login" onPress={() => console.log('Login Tapped')} color="primary"/>
                <AppButton title="Register" onPress={() => console.log('Register Tapped')} color="secondary"/>
            </View>
            

        </AnimatedImageBackground>  

    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        fadeIn: 1,
    },
    buttonContainer:{
        width: '100%',
        padding: 20,
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
    logoContainer:{
        justifyContent: 'center',
        alignItems: 'center',
        position:'absolute',
        top: 70,
    },
    logo:{
        width: 100, 
        height: 100,
        position:'absolute',
        top: 70
    },
    logoText:{
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        position:'absolute',
        top: 180,
        shadowOpacity: 0.5,
        shadowRadius: 2,
        textShadowRadius: 2,
        textShadowColor: 'black',
    }
})

export default Welcome;