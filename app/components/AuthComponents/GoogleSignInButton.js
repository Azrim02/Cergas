import React, { useEffect } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import { getAuth, signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import colors from "../../config/colors";
import Routes from "../../navigation/routes"; // Import navigation routes

const GoogleSignInButton = ({ navigation }) => {

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        androidClientId: "125198571106-f2pi0u4msdqef6r34ije8djo1pltk6ro.apps.googleusercontent.com",
        scopes: ["profile", "email"],
    });

    useEffect(() => {
        if (response) {
            console.log("Google Sign-In Response:", response);
        }

        if (response?.type === "success") {
            const { id_token } = response.params;
            const auth = getAuth();
            const credential = GoogleAuthProvider.credential(id_token);
            
            signInWithCredential(auth, credential)
                .then(userCredential => {
                    console.log("User signed in:", userCredential.user);
                    navigation.replace(Routes.HOME); // Redirect to Home screen
                })
                .catch(error => console.error("Google Sign-In Error:", error));
        }
    }, [response]);

    const handleGoogleSignIn = async () => {
        try {
            console.log("Google Sign-In Button Pressed");
            const result = await promptAsync();
            if (result?.type !== "success") {
                console.error("Google Sign-In Failed:", result);
            }
        } catch (error) {
            console.error("Google Sign-In Error:", error);
        }
    };

    return (
        <TouchableOpacity style={styles.button} onPress={handleGoogleSignIn}>
            <Text style={styles.buttonText}>Sign in with Google</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default GoogleSignInButton;