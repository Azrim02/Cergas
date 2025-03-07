import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View, Image, Text } from "react-native";
import * as Yup from "yup";
import { useAuth } from "../api/firebase/AuthProvider"

import GoogleSignIn from "../components/GoogleSignIn";
import colors from "../config/colors";
import AppForm from "../components/form/AppForm";
import AppFormField from "../components/form/FormField";
import SubmitButton from "../components/form/SubmitButton";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

function Login({ navigation }) {
  const { login } = useAuth(); // Get login function from context
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (values, { setErrors }) => {
    setLoginError(""); // Clear previous errors
    try {
      await login(values.email, values.password);
      navigation.navigate("Home"); // Redirect to Home after login
    } catch (error) {
      setErrors({ email: "Invalid email or password" }); // Show error message
      setLoginError(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require("../assets/favicon.png")} style={styles.logo} />
        <Text style={styles.logoText}>Welcome to Cergas App</Text>
      </View>
      <View style={styles.formContainer}>
        <AppForm
          initialValues={{ email: "", password: "" }}
          onSubmit={handleLogin}
          validationSchema={validationSchema}
        >
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
          {loginError ? <Text style={styles.errorMsg}>{loginError}</Text> : null}
          <SubmitButton title="Login" style={styles.loginButton} />
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
  loginButton: {
    flexGrow: 1,
  },
});

export default Login;
