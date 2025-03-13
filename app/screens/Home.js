import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useAuth } from '../api/firebase/AuthProvider';
import { useIsWorking } from '../context/IsWorkingProvider';
import { useSteps } from '../context/StepsProvider';

import Card from '../components/Card';
import colors from '../config/colors';
import { ImageBackground } from 'react-native';

const trackingDataOld = [
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

function Home(props) {
    const { user } = useAuth();
    const { workHourSteps, loading, error } = useSteps();
    const { isAtWork, isWithinWorkHours, distanceToWorkplace } = useIsWorking();
    var isWorking = isAtWork && isWithinWorkHours;
    
    const [trackingData, setTrackingData] = useState([
        {
            id: 1,
            data: "Steps",
            value: "Fetching...",
            lastUpdated: null,
            icon: "foot-print"
        }
    ]);

    console.log("🚀 Authenticated User:", user); // Debug auth
    // console.log("🚀 Workplace Data:", workplaceData); // Debug context data
    // console.log("🚀 Location Data:", location); // Debug context data
    
    // if (workplaceData && workplaceData.location) {
    //     console.log("🚀 Workplace coordinate: (" + workplaceData.location.latitude + "," + workplaceData.location.longitude + ")"); // Debug context data
    // } else {
    //     console.log("⚠️ Workplace data is not available yet.");
    // }

    // if (location) {
    //     console.log("🚀 Current location coordinate: (" + location.latitude + "," + location.longitude + ")"); // Debug context data
    // } else {
    //     console.log("⚠️ Location data is not available yet.");
    // }

    console.log("Distance to workplace:", distanceToWorkplace);
    // console.log("Is user at workplace?", isAtWork);
    // console.log("Is user within working hours?", isWithinWorkHours)
    console.log("Is user working ?", isWorking);
    console.log("Workplace steps:", workHourSteps);
    
    // Should dynamically change isWorking whenever distance changes
    useEffect(() =>{
        isWorking = isAtWork && isWithinWorkHours;
    }, [distanceToWorkplace])
    

    // Update step count in state when fetched
    useEffect(() => {
        if (!loading && !error) {
            setTrackingData([
                {
                    id: 1,
                    data: "Steps",
                    value: workHourSteps, // Assign fetched steps
                    lastUpdated: new Date().toLocaleTimeString(),
                    icon: "foot-print"
                }
            ]);
        }
    }, [workHourSteps, loading, error]);

    return (
        <View style={styles.container}>
            <ImageBackground source={require("../assets/heartbeat_monitor.webp")} style={styles.upperContainer}>
                    <Text style={styles.greetText}> Hello there, {user?.name} </Text>
                    <Text style={styles.isAtWorkText}>
                        {isAtWork 
                            ? `You are on site, ${isWithinWorkHours && isWorking ? "and you are working!" : "but you are not in your working hours."}`
                            : "You're not at work..."}
                    </Text>

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
            <Text>distance: {distanceToWorkplace}</Text>
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
        flexDirection: 'column',
        justifyContent: 'flex-end',    
    },
    listContainer:{
        padding:40,
    },
    greetText:{
        color: colors.white,
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'left',
        marginTop: 50,
        shadowColor: colors.black,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 10,
        padding: 20,
        paddingBottom:30,
    },
    isAtWorkText:{
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
        shadowColor: colors.black,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 10,
        paddingHorizontal:20,
        paddingBottom:10,
    },
    lowerContainer:{
        //margin:20,
        flex:3,
    }

})

export default Home;