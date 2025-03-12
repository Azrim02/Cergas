import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth, AuthProvider } from "./app/api/firebase/AuthProvider"; 

import { LocationProvider } from "./app/context/LocationProvider"; 
import { WorkplaceProvider } from "./app/context/WorkplaceProvider"; 
import { IsWorkingProvider } from "./app/context/IsWorkingProvider";

import TabNavigator from "./app/navigation/TabNavigator"; 
import AuthNavigator from "./app/navigation/AuthNavigator"; 

function MainApp() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <LocationProvider> 
          <WorkplaceProvider> 
            <IsWorkingProvider>
              <TabNavigator />
            </IsWorkingProvider>
          </WorkplaceProvider>
        </LocationProvider>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

// Centralized Styles
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
