import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import colors from '../config/colors';
import AppText from './AppText/AppText';

function Card({title, subTitle, image}) {
    return (
        <View style={styles.card}>
            <Image style={styles.image} source={image}/>
            <View style={styles.cardText}>
                <AppText style={styles.cardTitle}>{title}</AppText>
                <AppText style={styles.cardSubTitle}>{subTitle}</AppText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card:{
        borderRadius: 15,
        backgroundColor: colors.white,
        marginBottom:20,
        overflow:'hidden',
    },
    image:{
        width:'100%',
        height:200,
    },
    cardText:{
        padding:20,
    },
    cardTitle:{
        marginBottom: 7,
        
    },
    cardSubTitle:{
        marginBottom:1,
        fontWeight:'bold'
    }

})

export default Card;
