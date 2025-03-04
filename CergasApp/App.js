import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth, AuthProvider } from "./app/api/firebase/AuthProvider"; // Import Auth Context
import { WorkplaceProvider } from "./app/context/WorkplaceContext"; // Import Workplace Context

import TabNavigator from "./app/navigation/TabNavigator"; // Main App
import AuthNavigator from "./app/navigation/AuthNavigator"; // Login/Register

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
        <WorkplaceProvider> 
          <TabNavigator />
        </WorkplaceProvider>
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
