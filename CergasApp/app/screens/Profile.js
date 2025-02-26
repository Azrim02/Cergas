import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Icon } from 'react-native';
import colors from '../config/colors';
import Routes from '../navigation/routes';
import ListItem from '../components/ListItem';
import ListItemSeparator from '../components/ListItemSeparator';

const list = [
    {
        id: "1",
        title: "Link Health",
        icon: {
            name: "heart-pulse",
            //backgroundColor: colors.primary,
        },
        //targetScreen: Routes.USER_LISTINGS,
        data: { userListings: true },
    },
    {
        id: "2",
        title: "Workplace Details",
        icon: {
            name: "office-building",
            //backgroundColor: colors.secondary,
        },
        targetScreen: Routes.WORKPLACE_DETAILS,
        data: {},
    },
    {
        id: "3",
        title: "Settings",
        icon: {
            name: "cog",
            //backgroundColor: colors.secondary,
        },
        //targetScreen: Routes.MESSAGES,
        data: {},
    },
]

function Profile({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.profileContainer}>
                <ListItem
                    title={"Username"}
                    subTitle={"Student"}
                    image={require("../assets/profile_photo.jpeg")}
                />
            </View>
            <View style={styles.listContainer}>
                <FlatList
                    style={styles.list}
                    data={list}
                    keyExtractor={list => list.id.toString()}
                    renderItem={({ item }) => (
                        <ListItem
                            selection={item.title}
                            iconName={item.icon.name}
                            iconSize={40}
                            onPress={() => navigation.navigate(item.targetScreen)}
                        />  
                    )}
                    ItemSeparatorComponent={ListItemSeparator}
                />
            </View>
            <View style={styles.logoutContainer}>
                <ListItem
                    selection={"Logout"}
                    iconName={"logout"}
                    iconSize={40}
                    onPress={() => console.log("Logout pressed")}
                />  
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightgrey,
    },
    profileContainer: {
        marginVertical: 20,
        backgroundColor: colors.white,
    },
    listContainer: {
        backgroundColor: colors.white,
    },
    logoutContainer: {
        marginVertical: 20,
        backgroundColor: colors.white,
    },
    list: {
        marginBottom: 0,
    },

})

export default Profile;