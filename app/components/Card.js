import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import colors from '../config/colors';

function Card({ title, subTitle, image, onPress, icon, lastUpdated, chevron = true }) {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.card}>
                {icon ? (
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name={icon} size={80} color={colors.grey} />
                    </View>
                ) : image ? (
                    <Image style={styles.image} source={image} />
                ) : null }

                <View style={styles.cardText}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    {subTitle ? <Text style={styles.cardSubTitle}>{subTitle}</Text> : null}
                    {lastUpdated ? <Text style={styles.lastUpdated}>{lastUpdated}</Text> : null}
                </View>

                {chevron ? (
                    <View style={styles.cardChevron}>
                        <MaterialCommunityIcons name="chevron-right" size={50} color={colors.grey} />
                    </View>
                ) : null}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card:{
        borderRadius: 15,
        backgroundColor: colors.white,
        marginBottom:20,
        overflow:'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
    },
    image:{
        width: 100,
        height: '100%',
    },
    iconContainer:{
        width: 100,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardText:{
        padding:20,
        flex:1,
    },
    cardTitle:{
        marginBottom: 7,
        
    },
    cardSubTitle:{
        marginBottom:1,
        fontWeight:'bold'
    },
    lastUpdated:{
        color: colors.grey,
        fontSize: 10,
        marginTop: 10,
    },
    cardChevron:{
        //backgroundColor: colors.secondary,
        width: 50,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    }


})

export default Card;
