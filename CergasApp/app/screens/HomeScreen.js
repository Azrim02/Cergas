import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Card from '../components/Card';
import colors from '../config/colors';
import { ImageBackground } from 'react-native';

const trackingData = [
    {
        id: 1,
        data: "Heart Rate",
        value: "80 bpm",
        lastUpdated: "2024-10-10",
        //image: require("../assets/heartbeat_monitor.webp")
        icon: "heart-pulse",
    },
    {
        id: 2,
        data: "Steps Taken",
        value: 1500,
        lastUpdated: "2024-10-10",
        icon: "foot-print",
    },
    {
        id: 3,
        data: "Elevation Gain",
        value: 40,
        lastUpdated: "2024-10-10",
        icon: "stairs-up",
    }
];

function HomeScreen(props) {
    return (
        <View style={styles.container}>
            <ImageBackground source={require("../assets/heartbeat_monitor.webp")} style={styles.upperContainer}>
                    <Text style={styles.greetText}> Hello, USERNAME </Text>
            </ImageBackground>
            <View style={styles.lowerContainer}>
                <FlatList
                    style={styles.listContainer}
                    data={trackingData}
                    keyExtractor={trackingData => trackingData.id.toString()}
                    renderItem={({ item }) => (
                        <Card
                            title={item.data}
                            subTitle={item.value}
                            image={item.image}
                            icon={item.icon}
                            lastUpdated={"" + item.lastUpdated}
                            onPress={() => console.log("Card clicked", item)}
                        />
                    )}
                />

            </View>
            <Text> Home </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightgrey,
        //justifyContent: 'center',
        //alignItems: 'center',
    },
    upperContainer:{
        flex:1,
        backgroundColor: colors.lightgrey,        
    },
    listContainer:{
        padding:40,
    },
    greetText:{
        color: colors.white,
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'left',
        marginTop: 100,
        shadowColor: colors.black,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 10,
        padding: 20,
    },
    lowerContainer:{
        //margin:20,
        flex:3,
    }

})

export default HomeScreen;