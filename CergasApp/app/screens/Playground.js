import React, { act } from 'react';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { FontAwesome } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import AppText from '../components';
import Card from '../components/Card';
import ListItem from '../components/ListItem';
import { Button } from '@react-navigation/elements';

const Tweets = ({navigation}) => (
    <SafeAreaView>
        <Text> Tweets </Text>
        <Button
            title="View Tweet" 
            onPress={() => navigation.navigate('TweetDetails')}
        />
    </SafeAreaView>
)

const TweetDetails = () => (
    <SafeAreaView>
        <Text> Tweets Details </Text>
    </SafeAreaView>
);

const Account = () => (
    <SafeAreaView>
        <Text> Account </Text>
    </SafeAreaView>
)

const Stack = createStackNavigator();
const StackNavigator = () => (
    <Stack.Navigator >
        <Stack.Screen name="Tweets" component={Tweets}/>
        <Stack.Screen name="TweetDetails" component={TweetDetails}/>
    </Stack.Navigator>
);


const Tab = createBottomTabNavigator();
const TabNavigator = () => (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen 
            name="Feed" 
            component={StackNavigator}
            options={{
                tabBarIcon: ({size, color}) => <MaterialCommunityIcons name="home" size={size} color={color}/>
            }} 
        />
        <Tab.Screen 
            name="Account" 
            component={Account}
            options={{
                tabBarIcon: ({size, color}) => <MaterialCommunityIcons name="account" size={size} color={color}/>
            }} 
        />
    </Tab.Navigator>
);

function Playground(props) {
    return (

        <NavigationContainer>
            <TabNavigator/>
        </NavigationContainer>

        /* <View style={styles.container}>
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
        </View> */
        
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