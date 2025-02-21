import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import AppText from '../components/AppText';
import colors from '../config/colors';

function TrackingDataScreen(props) {
    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require("../assets/heartbeat_monitor.webp")}/>
            <View style={styles.cardText}>
                <AppText style={styles.cardTitle}>Heart Rate</AppText>
                <AppText style={styles.cardSubTitle}>80bpm</AppText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:colors.white,
        flex:1
    },
    image:{
        width:'100%',
        height:300,
    },
    cardText:{
        padding:20,
    },
    cardTitle:{
        fontSize: 24,
        marginBottom: 7,
    },
    cardSubTitle:{
        fontSize: 30,
        marginBottom:1,
        fontWeight:'bold'
    }
})

export default TrackingDataScreen;