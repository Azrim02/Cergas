import React, {useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
//import DateTimePicker from '@react-native-community/datetimepicker';

function WorkplaceDetails(props) {
    const [chosenDate, setChosenDate] = useState(new Date());

    return (
        <View style={styles.container}>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default WorkplaceDetails;