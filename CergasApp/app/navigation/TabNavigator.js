import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreen from '../screens/Home';
import routes from './routes';
import { NavigationContainer } from '@react-navigation/native';
import ProfileNavigator from './ProfileNavigator';

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
                    component={ProfileNavigator} 
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