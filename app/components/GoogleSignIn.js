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
  const [error, setError] = useState(null);

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
          setError('Authentication failed. Please try again.');
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
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      {user && (
        <View>
          <Text>Welcome {user.name}!</Text>
          <Text>Email: {user.email}</Text>
          {user.photoUrl && <Image source={{ uri: user.photoUrl }} style={{ width: 100, height: 100 }} />}
        </View>
      )}
    </View>
  );
};

export default GoogleSignIn;
