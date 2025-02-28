import React from "react"
import { View, TextInput, StyleSheet } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"

import colors from "../config/colors"
//import defaultStyles from "../config/styles"

const AppTextInput = ({
    style,
    icon,
    iconStyle,
    onChangeText,
    placeholder,
    value,
    width = "100%",
    ...otherProps
}) => {
    return (
        <View style={[styles.container, { width }]}>
            {icon && (
                <MaterialCommunityIcons
                    name={icon}
                    style={[styles.icon, iconStyle]}
                />
            )}
            <TextInput
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.grey}
                style={[styles.text, style]}
                value={value}
                {...otherProps}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: colors.lightgrey,
        borderColor: "#ddd",
        borderRadius: 50,
        borderWidth: 1,
        marginVertical: 6,
        overflow: "hidden",
        flexDirection: "row",
        paddingHorizontal: 10,
    },
    icon: {
        color: colors.grey,
        fontSize: 20,
        marginRight: 10,
    },
    text: {
        //...defaultStyles.text,
        flex: 1,
        paddingVertical: 10,
        fontSize:20
    },
})

export default AppTextInput
