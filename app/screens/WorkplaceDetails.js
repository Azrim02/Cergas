import React, {useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Button, Alert } from 'react-native';
import MapView, { Marker, Circle } from "react-native-maps";

import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { useWorkplace } from '../context/WorkplaceProvider';

import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from "@react-native-community/slider";

const daysOfWeek = [
    { id: 0, name: "Sun" },
    { id: 1, name: "Mon" },
    { id: 2, name: "Tue" },
    { id: 3, name: "Wed" },
    { id: 4, name: "Thu" },
    { id: 5, name: "Fri" },
    { id: 6, name: "Sat" },
];

function WorkplaceDetails({ navigation }) {
    // USER DATA
    // Fetched workplace data from firebase
    const { workplaceData, saveWorkplaceDetails, loading: workplaceLoading } = useWorkplace();

    // DEVICE DATA
    const { currentLocation, loading: locationLoading } = useCurrentLocation();
    
    // LOCAL DATA
    // Date-time variables
    const [selectedDays, setSelectedDays] = useState([]);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
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

    // Location Variable
    const [selectedLocation, setSelectedLocation] = useState({
        latitude: 53.46743878,
        longitude: -2.2340612,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
    });
    
    const [radius, setRadius] = useState(100);
    const mapRef = useRef(null); 

    // Debug print
    console.log("🚀 Workplace Data:", workplaceData); // Debug context data

    const toggleDay = (day) => {
        setSelectedDays((prevDays) =>
        prevDays.includes(day)
            ? prevDays.filter((d) => d !== day)
            : [...prevDays, day]
        );
    };

    const onChangeStartTime = (event, selectedTime) => {
        if (selectedTime) {
        setStartTime(selectedTime); 
        setShowStartPicker(false); 
        }
    };
    const onChangeEndTime = (event, selectedTime) => {
        if (selectedTime) {
        setEndTime(selectedTime);
        setShowEndPicker(false); 
        }
    };

        
    // Function to get Location, set location and fill into the map UI
    const getCurrentLocation = () => {
        if (!currentLocation) {
            Alert.alert("Error", "Location not available. Please enable location services.");
            return;
        }
    
        const { latitude, longitude } = currentLocation;
    
        // Update state
        setSelectedLocation({
            latitude,
            longitude,
            latitudeDelta: 0.005, // Zoom level
            longitudeDelta: 0.005,
        });
    
        // Animate the map to the new location
        if (mapRef.current) {
            mapRef.current.animateToRegion({
                latitude,
                longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            }, 1000); // 1-second animation
        }
    
        console.log("📍 Updated Selected Location:", currentLocation);
    };
    

    // Function to Save Workplace Details in Firestore
    const handleSave = async () => {
        if (!selectedDays.length) {
            Alert.alert('Error', 'Please select at least one working day.');
            return;
        }

        const data = {
            selectedDays,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            location: {
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                radius,
            }
        };

        try {
            await saveWorkplaceDetails(data);
            Alert.alert('Success', 'Workplace details saved successfully!');
            navigation.goBack(); // Navigate back after saving
        } catch (error) {
            console.error('Error saving data:', error);
            Alert.alert('Error', 'Failed to save workplace details.');
        }
    };

    useEffect(() => {
        if (workplaceData) {
            setSelectedDays(workplaceData.selectedDays || []);
            setStartTime(new Date(workplaceData.startTime));
            setEndTime(new Date(workplaceData.endTime));
            setSelectedLocation({
                latitude: workplaceData.location.latitude,
                longitude: workplaceData.location.longitude,
                latitudeDelta: 0.005,  // 🔹 Zoom level: More zoomed in
                longitudeDelta: 0.005,
            });
            setRadius(workplaceData.location?.radius || 100);
    
            console.log("✅ Updated workplace data:", workplaceData);
    
            // 🔹 Ensure the map zooms to the correct region when data is available
            if (mapRef.current) {
                mapRef.current.animateToRegion({
                    latitude: workplaceData.location.latitude,
                    longitude: workplaceData.location.longitude,
                    latitudeDelta: 0.005,  // Adjust zoom level
                    longitudeDelta: 0.005,
                }, 1000);
            }
        }
    }, [workplaceData]);
    

    useEffect(() => {
        if (mapRef.current && selectedLocation) {
            mapRef.current.animateToRegion(
                {
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                },
                1000 // 1-second animation
            );
        }
    }, []);

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
            <View style={styles.timeSelection}>
                <View>
                    <Text style={styles.header2}>Start Time</Text>
                        <Button title={startTime.toLocaleTimeString()} onPress={() => setShowStartPicker(true)} />
                        {showStartPicker && (
                            <DateTimePicker
                                value={startTime}
                                mode="time"
                                display="default"
                                onChange={onChangeStartTime}
                            />
                        )}
                </View>
                <View>
                    <Text style={styles.header2}>End Time</Text>
                        <Button title={endTime.toLocaleTimeString()} onPress={() => setShowEndPicker(true)} />
                        {showEndPicker && (
                            <DateTimePicker
                                value={endTime}
                                mode="time"
                                display="default"
                                onChange={onChangeEndTime}
                            />
                        )}
                </View>

            </View>
            <Text style={styles.header1}>Location</Text>
            <View style={styles.mapContainer}>             
                <MapView
                    provider="google"
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={selectedLocation}
                    showsUserLocation={true}
                    showsMyLocationButton={true} 
                    onPress={(e) =>
                    setSelectedLocation({
                        ...e.nativeEvent.coordinate,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    })
                    }
                >
                    {/* Circle Around Marker */}
                    <Circle
                        center={selectedLocation}
                        radius={radius}
                        strokeWidth={2}
                        strokeColor="rgba(0,122,255,0.8)" // Blue border
                        fillColor="rgba(0,122,255,0.3)" // Light blue fill
                    />

                    {/* Draggable Marker */}
                    <Marker
                        coordinate={selectedLocation}
                        draggable
                        onDragEnd={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
                    />
                </MapView>
            </View>
            <View style={styles.mapSettingContainer}>
                <View style={styles.mapSettingItem}>
                    {/*
                    <Text>Current Location:</Text>
                    {errorMsg ? <Text>{errorMsg}</Text> : null}
                    {selectedLocation ? (
                        <Text>Latitude: {selectedLocation.latitude}, Longitude: {selectedLocation.longitude}</Text>
                    ) : (
                        <Text>Fetching location...</Text>
                    )}
                        */}
                    <Button title="Get Current Location" onPress={getCurrentLocation} />
                </View>
                <View style={styles.mapSettingItem}>
                    <Text>Radius: {radius} meters</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={100}
                        maximumValue={1000}
                        step={10}
                        value={radius}
                        onValueChange={(value) => setRadius(value)}
                    />
                </View>
            </View>
            <Button title="Save Workplace" onPress={handleSave} />
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
        marginBottom: 5,
        marginTop: 20,
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
        width: 45,
        margin: 0,
        padding: 1,
        borderWidth: 1,
        borderRadius: 0,
        borderColor: "#3498db",
    },
    selectedDay: {
        backgroundColor: "#3498db",
    },
    dayText: {
        fontSize: 16,
        color: "#3498db",
        alignSelf: "center",
    },
    selectedText: {
        color: "white",
    },
    selectedDaysText: {
        marginTop: 15,
        fontSize: 16,
        fontWeight: "bold",
    },   
    timeSelection: {
        margin: 10,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    }, 
    mapContainer: {
        //justifyContent: "center",
        //alignItems: "center",
        height: 500,
    },
    map: {
        width: '100%',
        height: '100%', 
    },
    mapSettingContainer: {
        margin: 0,
        flexDirection: 'row',
        flex:1,
        justifyContent: 'space-evenly',
    },
    mapSettingItem: {
        width: "45%", // Make the inner views smaller
        padding: 10,
        backgroundColor: "#f0f0f0", // Optional: background color
        borderRadius: 10, // Optional: rounded corners
        alignItems: 'center', // Center content
    },
    slider: {
        width: "100%", // Make the slider fit inside
    },

})

export default WorkplaceDetails;