import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
//import { NavigationContainer } from '@react-navigation/native';


function HomeScreen(props) {
    return (
        <View style={styles.backgroundView}>
            <Text>Hello</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    backgroundView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        colors: "#fff",
    },
})

export default HomeScreen;