import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import colors from '../config/colors';

function AppButton({title, onPress, color}) {
    return (
        <View style={[styles.button]}>
            <TouchableOpacity  onPress={onPress}>   
                <Text style={styles.text}>{title}</Text>
            </TouchableOpacity>
        </View>
        
    );
}

const styles = StyleSheet.create({
    button:{
        width: '100%',
        backgroundColor: colors.primary,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        marginVertical: 5,
    },
    text:{
        color: colors.white,
        fontSize: 18,
        textTransform: 'uppercase',
        fontWeight: 'bold',
    }
})

export default AppButton;