import React, { useEffect } from 'react';
import { Button, View } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import { firebase } from '../api/firebase/firebaseConfig';

const CLIENT_ID = '125198571106-aduo4ttbumjhesftd42ucup3n1rdqp1d.apps.googleusercontent.com';

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

export default function GoogleFitAuth() {
  const redirectUri = AuthSession.makeRedirectUri({ 
    scheme: 'cergasapp',
    useProxy: true,
    projectNameForProxy: '@azrim02/CergasApp',
  });
  console.log('Redirect URI:', redirectUri);
  
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ['https://www.googleapis.com/auth/fitness.activity.read'],
      redirectUri,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token, refresh_token } = response.params;

      // Store tokens securely in Firebase Firestore under user ID
      const user = firebase.auth().currentUser;
      if (user) {
        firebase.firestore().collection('users').doc(user.uid).set({
          googleFitAccessToken: access_token,
          googleFitRefreshToken: refresh_token,
        }, { merge: true });
      }
    }
  }, [response]);

  return (
    <View>
      <Button
        disabled={!request}
        title="Connect to Google Fit"
        onPress={() => promptAsync({useProxy:true})}
      />
    </View>
  );
}
