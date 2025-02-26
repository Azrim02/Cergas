import React, {useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Platform, PermissionsAndroid, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const daysOfWeek = [
    { id: 0, name: "Sun" },
    { id: 1, name: "Mon" },
    { id: 2, name: "Tue" },
    { id: 3, name: "Wed" },
    { id: 4, name: "Thu" },
    { id: 5, name: "Fri" },
    { id: 6, name: "Sat" },
];

function WorkplaceDetails(props) {

    const [selectedDays, setSelectedDays] = useState([]);

    const toggleDay = (day) => {
        setSelectedDays((prevDays) =>
        prevDays.includes(day)
            ? prevDays.filter((d) => d !== day)
            : [...prevDays, day]
        );
    };

    const [startTime, setStartTime] = useState(() => {
        let date = new Date();
        date.setHours(9, 0, 0, 0); // 09:00:00.000
        return date;
    });
      
    const [endTime, setEndTime] = useState(() => {
        let date = new Date();
        date.setHours(17, 0, 0, 0); // 17:00:00.000
        return date;
    });
      
    //const [show, setShow] = useState(false);
    

    const onChangeStartTime = (event, selectedTime) => {
        //setShow(false); // Hide the picker after selection
        if (selectedTime) {
        setStartTime(selectedTime); // Update time
        }
    };

    const onChangeEndTime = (event, selectedTime) => {
        //setShow(false); // Hide the picker after selection
        if (selectedTime) {
        setEndTime(selectedTime); // Update time
        }
    };


    const [selectedLocation, setSelectedLocation] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });
    
    const mapRef = useRef(null);
    
    const handleLocationSelect = (data, details) => {
        const location = details.geometry.location;
        setSelectedLocation({
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
    
        // Move map to the selected location
        mapRef.current.animateToRegion({
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
    };

    return (
        <ScrollView>
        <View style={styles.container}>
            <Text style={styles.header1}>Working Days</Text>
            <View style={styles.daySelection}>
                <View style={styles.daysContainer}>
                    {daysOfWeek.map((day) => (
                        <TouchableOpacity
                            key={day.id}
                            style={[
                            styles.dayButton,
                            selectedDays.includes(day.name) && styles.selectedDay,
                            ]}
                            onPress={() => toggleDay(day.name)}
                        >
                            <Text
                                style={[
                                    styles.dayText,
                                    selectedDays.includes(day.name) && styles.selectedText,
                                ]}
                                >
                                {day.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                {/*<Text style={styles.selectedDaysText}>
                    Selected: {selectedDays.length > 0 ? selectedDays.join(", ") : "None"}
                </Text>*/}
            </View>
            <Text style={styles.header1}>Office Hours</Text>
            <View>
                <Text style={styles.header2}>Select Start Time</Text>
                <DateTimePicker
                    value={startTime}
                    mode="time"
                    //display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onChangeStartTime}
                />
                <Text style={styles.header2}>Select End Time</Text>
                <DateTimePicker
                    value={endTime}
                    mode="time"
                    //display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onChangeEndTime}
                />
                
                
            </View>
            <Text style={styles.header1}>Location</Text>
            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={selectedLocation}
                    onPress={(e) =>
                    setSelectedLocation({
                        ...e.nativeEvent.coordinate,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    })
                    }
                >
                    {/* Marker for selected location */}
                    <Marker coordinate={selectedLocation} />
                </MapView>
            </View>  
        </View>             
        </ScrollView>
        
    );
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        margin:20,
        //justifyContent: 'center',
        //alignItems: 'center',
    },
    header1:{
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 10,
    },
    header2:{
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10,
    },
    daysContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    dayButton: {
        margin: 5,
        padding: 10,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: "#3498db",
    },
    selectedDay: {
        backgroundColor: "#3498db",
    },
    dayText: {
        fontSize: 16,
        color: "#3498db",
    },
    selectedText: {
        color: "white",
    },
    selectedDaysText: {
        marginTop: 15,
        fontSize: 16,
        fontWeight: "bold",
    },    
    mapContainer: {
        justifyContent: "center",
        alignItems: "center",
        height: 500,
    },
    map: {
        width: '100%',
        height: '100%', 
    },
})

export default WorkplaceDetails;