import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import routes from './routes';
import Profile from '../screens/Profile';
import WorkplaceDetails from '../screens/WorkplaceDetails';
import LinkHealth from '../screens/LinkHealth';
import DailyHealthScreen from '../screens/DailyHealthScreen';

const Stack = createStackNavigator();

function ProfileNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name={routes.PROFILE} component={Profile} />
            <Stack.Screen name={routes.LINK_HEALTH} component={LinkHealth} />
            <Stack.Screen name={routes.DAILY_HEALTH_SCREEN} component={DailyHealthScreen} />
            <Stack.Screen name={routes.WORKPLACE_DETAILS} component={WorkplaceDetails} />
            <Stack.Screen name="Settings" component={LinkHealth} />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    
})

export default ProfileNavigator;