import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { FontAwesome } from '@expo/vector-icons';
import AppText from '../components';
import Card from '../components/Card';
import ListItem from '../components/ListItem';

function Playground(props) {
    return (
        <View style={styles.container}>
            <Card
                title="Heart Rate"
                subTitle="80bpm"
                image={require("../assets/heartbeat_monitor.webp")}
            />
            <ListItem 
                image={require("../assets/profile_photo.jpeg")}
                title="A person"
                subTitle="Basic user"
            />
            
            <AppText>I love being CERGAS!</AppText>
            <MaterialCommunityIcons name='email' size={60} color={"orange"}/>
            <View style={styles.outerBox}>
                <View style={styles.innerBox}>

                </View>
            </View>
        </View>
        
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        //alignItems:'center',
        //justifyContent:'center',
        backgroundColor: "dodgerblue",
        padding:20,
        paddingTop:100,
    },
    outerBox:{
        height:100,
        width:100,
        backgroundColor:'dodgerblue',
        padding:20,
        paddingLeft:20
    },
    innerBox:{
        height:50,
        width:50,
        margin:10,
        backgroundColor:'gold'
    },
    textStyle:{
        fontSize:30,
        //fontFamily: 'Roboto',
        fontStyle: 'italic',
        fontWeight: 600,
        color: "#AAA",
    }
})

export default Playground;