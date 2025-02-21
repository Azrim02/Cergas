import React from 'react';

import { View, Dimensions, StyleSheet } from 'react-native';
import WelcomeScreen from './app/screens/WelcomeScreen';
import ViewImageScreen from './app/screens/ViewImageScreen';
import HomeScreen from './app/screens/HomeScreen';
import Playground from './app/screens/Playground';
import AppButton from './app/components/AppText/AppButton';

export default function App() {
  const handlePress = () => console.log('Text clicked');
  console.log(Dimensions.get('screen'));
  return (
    //<WelcomeScreen/>
    <Playground/>
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
