import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View, Image, Text, ActivityIndicator } from "react-native";
import * as Yup from "yup";
import { useAuth } from "../api/firebase/AuthProvider"

import colors from "../config/colors";
import AppForm from "../components/form/AppForm";
import AppFormField from "../components/form/FormField";
import SubmitButton from "../components/form/SubmitButton";

const validationSchema = Yup.object().shape({
    name: Yup.string().required().min(1).label("Name"),
    email: Yup.string().required().email().label("Email"),
    password: Yup.string().required().min(6).label("Password"), // Firebase requires min 6 characters
});

function Register({ navigation }) {
    const { register } = useAuth(); // Get register function from context
    const [registerError, setRegisterError] = useState("");
    const [loading, setLoading] = useState(false); // Add loading state

    const handleRegister = async (values, { setErrors }) => {
        setRegisterError(""); // Clear previous errors
        setLoading(true); // Show loader while processing
        try {
            await register(values.email, values.password, values.name);
            navigation.navigate("Login"); // Redirect to Login after success
        } catch (error) {
            setErrors({ email: error.message }); // Show Firebase error messages
            setRegisterError(error.message);
        }
        setLoading(false); // Hide loader after process
    };

  return (
      <SafeAreaView style={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={require("../assets/favicon.png")} style={styles.logo} />
            <Text style={styles.logoText}>Welcome to Cergas App</Text>
          </View>
          <View style={styles.formContainer}>
              <AppForm
                  initialValues={{ name: "", email: "", password: "" }} // Ensure name is included
                  validationSchema={validationSchema}
                  onSubmit={handleRegister}
              >
                  <AppFormField
                      autoCapitalize="words"
                      autoCorrect={false}
                      icon="account"
                      name="name"
                      placeholder="Full Name"
                  />
                  <AppFormField
                      autoCapitalize="none"
                      autoCorrect={false}
                      icon="email"
                      keyboardType="email-address"
                      name="email"
                      placeholder="Email"
                      textContentType="emailAddress"
                  />
                  <AppFormField
                      autoCapitalize="none"
                      autoCorrect={false}
                      icon="lock"
                      name="password"
                      placeholder="Password"
                      secureTextEntry
                      textContentType="password"
                  />
                  {registerError ? <Text style={styles.errorMsg}>{registerError}</Text> : null}
                  {loading ? (
                      <ActivityIndicator size="large" color="#0000ff" /> // Show loader when registering
                  ) : (
                      <SubmitButton title="Register" style={styles.registerButton} />
                  )}
              </AppForm>
          </View>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    logoContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
    logo: {
      height: 80,
      width: 80,
      alignSelf: "center",
      marginTop: 50,
      marginBottom: 20,
    },
    formContainer: {
      margin: 30,
    },
    errorMsg: {
      color: "red",
      textAlign: "center",
      marginVertical: 10,
    },
    registerButton: {
      flexGrow: 1,
    },
  });

export default Register;
