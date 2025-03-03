import React from 'react';

import { View, Dimensions, StyleSheet } from 'react-native';
import TabNavigator from './app/navigation/TabNavigator';
import AuthNavigator from './app/navigation/AuthNavigator';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  console.log(Dimensions.get('screen'));
  return (
    
      <NavigationContainer>
        <TabNavigator/> 
      </NavigationContainer>
    
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
