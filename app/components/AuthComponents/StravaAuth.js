import React, { useEffect, useState } from "react";
import { Button, View, Text, ActivityIndicator } from "react-native";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";

// Strava OAuth Endpoints
const discovery = {
    authorizationEndpoint: "https://www.strava.com/oauth/mobile/authorize",
    tokenEndpoint: "https://www.strava.com/oauth/token",
    revocationEndpoint: "https://www.strava.com/oauth/deauthorize",
};

const StravaAuth = ({ onAuthSuccess }) => {
    const [authCode, setAuthCode] = useState(null);
    const [loading, setLoading] = useState(false);
    const redirectUri = makeRedirectUri({
        native: "cergasapp://redirect", // Ensure this matches deep link settings
    })
    console.log("Redirecturi:", redirectUri)
    // Expo Auth Request
    const [request, response, promptAsync] = useAuthRequest(
        {
        clientId: "151482",
        scopes: ["activity:read_all"],
        redirectUri: makeRedirectUri({
            native: "cergasapp://redirect", // Ensure this matches deep link settings
        }),
        },
        discovery
    );

    // Handle authentication response
    useEffect(() => {
        if (response?.type === "success") {
        const { code } = response.params;
        setAuthCode(code);
        if (onAuthSuccess) {
            onAuthSuccess(code); // Pass auth code to parent component
        }
        }
    }, [response]);

    return (
        <View style={{ alignItems: "center", marginTop: 20 }}>
        {loading ? (
            <ActivityIndicator size="large" color="#FC5200" />
        ) : (
            <Button
            disabled={!request}
            title="Login with Strava"
            onPress={() => {
                setLoading(true);
                promptAsync().finally(() => setLoading(false));
            }}
            />
        )}

        {authCode && (
            <Text style={{ marginTop: 10, fontSize: 14 }}>
            ✅ Auth Code: {authCode}
            </Text>
        )}
        </View>
    );
};

export default StravaAuth;
