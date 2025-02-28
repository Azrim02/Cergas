import React from 'react';

import { View, Dimensions, StyleSheet } from 'react-native';
import Welcome from './app/screens/Welcome';
import ViewImageScreen from './app/screens/ViewImageScreen';
import HomeScreen from './app/screens/Home';
import Playground from './app/screens/Playground';
import AppButton from './app/components/AppButton';
import TrackingDataScreen from './app/screens/TrackingDataScreen';
import ProfileScreen from './app/screens/Profile';
import TabNavigator from './app/navigation/TabNavigator';
import Login from './app/screens/Login';
import Register from './app/screens/Register'
import AuthNavigator from './app/navigation/AuthNavigator';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  const handlePress = () => console.log('Text clicked');
  console.log(Dimensions.get('screen'));
  return (
    //<Welcome/>
    //<Login/>
    //<Register/>
    //<Playground/>
    //<HomeScreen/>
    //<ProfileScreen/>
    <NavigationContainer>
        <AuthNavigator/> 
    </NavigationContainer>
    //<TabNavigator/>
    //<TrackingDataScreen/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  }
})
