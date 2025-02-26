import React from 'react';
import { Text, View, StyleSheet, Image, TouchableHighlight } from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import colors from '../config/colors';

function ListItem({ title, subTitle, image, onPress, selection, iconName, iconSize, iconColor }) {
    return (
        <TouchableHighlight underlayColor={colors.lightgrey} onPress={onPress}>
            <View style={styles.container}>
                {iconName && <MaterialCommunityIcons style={styles.icon} name={iconName} size={iconSize} color={iconColor}/>}
                {image && <Image style={styles.image} source={image}/>}
                <View>
                    {title ? <Text style={styles.title}>{title}</Text> : null }
                    {subTitle ? <Text style={styles.subTitle}>{subTitle}</Text> : null}
                    {selection ? <Text style={styles.selection}>{selection}</Text> : null}                
                </View>
            </View>
        </TouchableHighlight>
        
    );
}

const styles = StyleSheet.create({
    container:{
        flexDirection: "row",
        padding:15,
        //justifyContent: "center",
        alignItems: "center",
    },
    image:{
        width:70,
        height:70,
        borderRadius:35,
        marginRight:20,
    },
    icon:{
        marginRight:20,
    },
    title:{
        fontWeight: "500",
        fontSize: 20,
    },
    subTitle:{
        color: colors.grey,
    },
    selection:{
        //fontWeight: "500",
        fontSize: 18,
    }

})

export default ListItem;