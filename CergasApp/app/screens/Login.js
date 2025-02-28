import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Image, Text } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import colors from '../config/colors';
import TextInput from '../components/TextInput';
import AppButtona from '../components/AppButton';
import AppForm from '../components/form/AppForm';
import AppFormField from '../components/form/FormField';
import SubmitButton from '../components/form/SubmitButton';
const validationSchema = Yup.object().shape({
    email: Yup.string().required().email().label("Email"),
    password: Yup.string().required().min(4).label("Password")

})

function Login(props) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require('../assets/favicon.png')} style={styles.logo}/>
                <Text style={styles.logoText}>Welcome to Cergas App</Text>
            </View>
            <View style={styles.formContainer}>
                <AppForm
                    initialValues={{ email: '', password: ''}}
                    onSubmit={(values) => console.log(values)}
                    validationSchema={validationSchema}
                >
                    <AppFormField
                        autoCapitalize="none"
                        autoCorrect={false}
                        icon="email"
                        keyboardType='email-address'
                        name="email"
                        placeholder="Email"
                        textContentType='emailAddress'
                    />
                    <AppFormField
                        autoCapitalize='none'
                        autoCorrect={false}
                        icon="lock"
                        name="password"
                        placeholder='Password'
                        secureTextEntry
                        textContentType='password'
                    />
                    <SubmitButton title="login" style={styles.loginButton}/>
                </AppForm>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colors.white,
    },
    logoContainer:{
        justifyContent:'center',
        alignItems: 'center',
    },
    logo:{
        height: 80,
        width: 80,
        alignSelf: 'center',
        marginTop: 50,
        marginBottom:20,
    },
    formContainer:{
        margin:30,
    },
    errormsg:{
        color: 'red',
    },
    loginButton:{
        flexGrow:1,
    }

})

export default Login;