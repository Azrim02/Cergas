import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreen from '../screens/Home';
import ProfileScreen from '../screens/Profile';
import routes from './routes';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

function TabNavigator(props) {
    return (
        <NavigationContainer>
            <Tab.Navigator screenOptions={{headerShown: false}}>
                <Tab.Screen 
                    name={routes.HOME} 
                    component={HomeScreen} 
                    options={{
                        tabBarIcon: ({color, size}) => 
                        <MaterialCommunityIcons name="home" color={color} size={size}/>
                    }}
                    
                />
                <Tab.Screen 
                    name={routes.PROFILE} 
                    component={ProfileScreen} 
                    options={{
                        tabBarIcon: ({color, size}) => 
                        <MaterialCommunityIcons name="account" color={color} size={size}/>
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>

    );
}



export default TabNavigator;