import React from 'react';
import { View, Text } from 'react-native';
import StravaAuth from '../components/AuthComponents/StravaAuth'

function LinkHealth(props) {
    return (
        <View>
            <Text>Link Health Screen</Text>
            <StravaAuth/>
        </View>
    );
}

export default LinkHealth;