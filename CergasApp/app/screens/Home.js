import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useAuth } from '../api/firebase/AuthProvider';

import trackingsApi from '../api/trackings';

import Card from '../components/Card';
import colors from '../config/colors';
import { ImageBackground } from 'react-native';


function Home(props) {
    const { user, logout } = useAuth();
    const [trackings, setTrackings] = useState([]);

    useEffect(() => {
        loadTrackings();
    }, [])

    const loadTrackings = async () => {
        console.log("Fetching tracking data...");
    
        const response = await trackingsApi.getTrackings();
        
        console.log("Response Status:", response.status);
        console.log("Response Problem:", response.problem);
        console.log("Full Response:", response);
    
        if (!response.ok) {
            console.log("❌ API Request Failed!");
            return;
        }
    
        setTrackings(response.data);
        console.log("✅ Data Fetched Successfully:", response.data);
    };
    
    
    

    return (
        <View style={styles.container}>
            <ImageBackground source={require("../assets/heartbeat_monitor.webp")} style={styles.upperContainer}>
                    <Text style={styles.greetText}> Hello, {user?.name} </Text>
            </ImageBackground>
            <View style={styles.lowerContainer}>
                <FlatList
                    style={styles.listContainer}
                    data={trackings}
                    keyExtractor={trackings => trackings.id.toString()}
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

export default Home;