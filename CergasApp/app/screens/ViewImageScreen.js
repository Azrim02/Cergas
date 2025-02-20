import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

function ViewImageScreen(props) {
    return (

        <View style={styles.container}>
            <Image 
                style={styles.image}
                source={{uri: "https://cdn.naturettl.com/wp-content/uploads/2023/10/20173902/landscape-vs-portrait-orientation-4-534x800.jpg"}} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        //alignItems: 'center',
        justifyContent: 'center',   
    },
    image:{
        width: '100%',
        height: '90%',
        //alignSelf: 'center',
    }

})

export default ViewImageScreen;