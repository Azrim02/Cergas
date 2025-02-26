import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../screens/Profile';
import WorkplaceDetails from '../screens/WorkplaceDetails';

const Stack = createStackNavigator();

function ProfileNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Link Health" component={Profile} />
            <Stack.Screen name="Workplace Details" component={WorkplaceDetails} />
            <Stack.Screen name="Settings" component={Profile} />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    
})

export default ProfileNavigator;