import React, { useEffect, useState } from "react";
import { Button, View, Text, ActivityIndicator } from "react-native";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";

// Strava OAuth Endpoints
const discovery = {
    authorizationEndpoint: "https://www.strava.com/oauth/mobile/authorize",
    tokenEndpoint: "https://www.strava.com/oauth/token",
    revocationEndpoint: "https://www.strava.com/oauth/deauthorize",
};

const StravaAuth = () => {
    const [authCode, setAuthCode] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);

    const redirectUri = makeRedirectUri({ native: "cergasapp://redirect" });

    // Expo Auth Request
    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: "151482",
            scopes: ["activity:read_all"],
            redirectUri: redirectUri,
        },
        discovery
    );

    // Exchange auth code for access token
    const exchangeAuthCodeForToken = async (authCode) => {
        try {
            const response = await fetch("https://www.strava.com/oauth/token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    client_id: "151482", // Replace with your Strava Client ID
                    client_secret: "424fa8aa5cbb01faf2e9d61f663485f8099dafa4", 
                    code: authCode,
                    grant_type: "authorization_code",
                }),
            });

            const data = await response.json();
            console.log("Token Response:", data);

            if (data.access_token) {
                setAccessToken(data.access_token);
                fetchStravaProfile(data.access_token);
            } else {
                throw new Error("Failed to retrieve access token");
            }
        } catch (error) {
            console.error("Error exchanging auth code for token:", error);
        }
    };

    // Fetch Strava user profile
    const fetchStravaProfile = async (accessToken) => {
        try {
            const response = await fetch("https://www.strava.com/api/v3/athlete", {
                method: "GET",
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const profileData = await response.json();
            console.log("Strava Profile Data:", profileData);
            setProfile(profileData);
        } catch (error) {
            console.error("Error fetching Strava profile:", error);
        }
    };

    // Handle authentication response
    useEffect(() => {
        if (response?.type === "success") {
            const { code } = response.params;
            setAuthCode(code);
            exchangeAuthCodeForToken(code);
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

            {authCode && <Text style={{ marginTop: 10, fontSize: 14 }}>✅ Auth Code: {authCode}</Text>}

            {accessToken && <Text style={{ marginTop: 10, fontSize: 14 }}>🔑 Access Token: {accessToken}</Text>}

            {profile && (
                <View style={{ marginTop: 20 }}>
                    <Text>🏃 Strava Profile:</Text>
                    <Text>Name: {profile.firstname} {profile.lastname}</Text>
                    <Text>Username: {profile.username || "N/A"}</Text>
                    <Text>Country: {profile.country || "Unknown"}</Text>
                </View>
            )}
        </View>
    );
};

export default StravaAuth;
