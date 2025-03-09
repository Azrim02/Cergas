import React from 'react';
import { View, Text } from 'react-native';
import GoogleFitAuth from '../components/GoogleFitAuth';

function LinkHealth(props) {
    return (
        <View>
            <Text>Link Health Screen</Text>

            {/* Button to Connect Google Fit */}
            <GoogleFitAuth />
        </View>
    );
}

export default LinkHealth;