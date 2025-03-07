import React, { useEffect, useState } from 'react';
import { Button, Platform, View, Text } from 'react-native';
import * as Google from 'expo-auth-session';
import { firebase } from '../api/firebase/firebaseConfig'; 

const GoogleSignIn = () => {
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: Platform.select({
        ios: '125198571106-23mhqnk9ot5qudvl31753fgn4363bcva.apps.googleusercontent.com', // Use your actual iOS client ID from Firebase
        android: 'YOUR_ANDROID_CLIENT_ID', // Use your actual Android client ID from Firebase
        }),
    });

    const [user, setUser] = useState(null);

    useEffect(() => {
        if (response?.type === 'success') {
        const { id_token } = response.params;
        const credential = firebase.auth.GoogleAuthProvider.credential(id_token);

        // Sign in with the Google credential
        firebase
            .auth()
            .signInWithCredential(credential)
            .then((userCredential) => {
            const user = userCredential.user;
            setUser({
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                photoUrl: user.photoURL,
            });
            })
            .catch((error) => {
            console.error('Firebase authentication error:', error);
            });
        }
    }, [response]);

    return (
        <View>
        <Button
            title="Login with Google"
            onPress={() => promptAsync()}
            disabled={!request}
        />
        {user && (
            <View>
            <Text>Welcome {user.name}!</Text>
            <Text>Email: {user.email}</Text>
            </View>
        )}
        </View>
    );
    };

    export default GoogleSignIn;
