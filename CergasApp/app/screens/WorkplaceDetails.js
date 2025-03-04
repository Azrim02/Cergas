import React, {useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Button, Alert, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from 'expo-location';
import Slider from "@react-native-community/slider";
import { db, auth } from "../api/firebase/firebaseConfig"; 
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

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
    const [workplaces, setWorkplaces] = useState([]);

    useEffect(() => {
        const fetchUserWorkplaces = async () => {
            try {
                if (!auth.currentUser) return; // Ensure user is logged in
        
                const q = query(collection(db, "workplaces"), where("userId", "==", auth.currentUser.uid));
                const querySnapshot = await getDocs(q);
                const userWorkplaces = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                }));
                setWorkplaces(userWorkplaces);
            } catch (error) {
                console.error("Error fetching user workplaces:", error);
            }
        };
        fetchUserWorkplaces();
    }, []);

    
    // Day Selection
    const [selectedDays, setSelectedDays] = useState([]);
    const toggleDay = (day) => {
        setSelectedDays((prevDays) =>
        prevDays.includes(day)
            ? prevDays.filter((d) => d !== day)
            : [...prevDays, day]
        );
    };

    // Time Selection
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

    // Location Selection
    const [selectedLocation, setSelectedLocation] = useState({
        latitude: 53.46743878,
        longitude: -2.2340612,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
    });
    
    const [radius, setRadius] = useState(100);
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
    const [errorMsg, setErrorMsg] = useState(null);
    // Function to request permission and fetch location
    const getCurrentLocation = async () => {
        try {
            // Request permission
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
                Alert.alert("Permission Denied", "Please enable location services.");
                return;
            }
    
            // Fetch current location
            let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            const { latitude, longitude } = location.coords;
    
            // Update state
            setSelectedLocation({
                latitude,
                longitude,
                latitudeDelta: 0.01, // Zoom level
                longitudeDelta: 0.01,
            });
    
            // Animate the map to the new location
            if (mapRef.current) {
                mapRef.current.animateToRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }, 1000); // 1-second animation
            }
        } catch (error) {
            console.log("Location error:", error);
            setErrorMsg("Error fetching location");
        }
    };
    
    // Automatically fetch workplace details on mount
    useEffect(() => {
        const fetchUserWorkplaces = async () => {
            try {
                if (!auth.currentUser) return; // Ensure user is logged in
        
                const q = query(collection(db, "workplaces"), where("userId", "==", auth.currentUser.uid));
                const querySnapshot = await getDocs(q);
    
                if (!querySnapshot.empty) {
                    const userWorkplace = querySnapshot.docs[0].data(); // Get first document
    
                    // Set the fetched values as initial state
                    setSelectedDays(userWorkplace.selectedDays || []);
                    setStartTime(new Date(userWorkplace.startTime) || new Date());
                    setEndTime(new Date(userWorkplace.endTime) || new Date());
                    setSelectedLocation(userWorkplace.location || {
                        latitude: 53.46743878,
                        longitude: -2.2340612,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005
                    });
                    setRadius(userWorkplace.location.radius || 100);
                }
            } catch (error) {
                console.error("Error fetching user workplaces:", error);
            }
        };
    
        fetchUserWorkplaces();
    }, []);
    

    // Function to Save Workplace Details in Firestore
    const saveWorkplaceDetails = async () => {
        try {
        if (!selectedDays.length) {
            Alert.alert("Error", "Please select at least one working day.");
            return;
        }

        if (!auth.currentUser) {
            Alert.alert("Error", "User not logged in.");
            return;
        }

        const docRef = await addDoc(collection(db, "workplaces"), {
            userId: auth.currentUser.uid,
            selectedDays,
            startTime: new Date(startTime).toISOString(),
            endTime: new Date(endTime).toISOString(),
            location: {
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            radius,
            },
            createdAt: new Date().toISOString(),
        });

      Alert.alert("Success", "Workplace details saved successfully!");
      navigation.goBack(); // Navigate back after saving
    } catch (error) {
      console.error("Error saving data:", error);
      Alert.alert("Error", "Failed to save workplace details.");
    }
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
            <View style={styles.timeSelection}>
                <View>
                    <Text style={styles.header2}>Start Time</Text>
                    <DateTimePicker
                        value={startTime}
                        mode="time"
                        //display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={onChangeStartTime}
                    />
                </View>
                <View>
                    <Text style={styles.header2}>End Time</Text>
                    <DateTimePicker
                        value={endTime}
                        mode="time"
                        //display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={onChangeEndTime}
                    />
                </View>

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
            <Button title="Save Workplace" onPress={saveWorkplaceDetails} />
        </View>      
        <View>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Your Workplace Data</Text>
            <FlatList
                data={workplaces}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                <View style={{ marginBottom: 10 }}>
                    <Text>📍 Location: {item.location.latitude}, {item.location.longitude}</Text>
                    <Text>📅 Days: {item.selectedDays.join(", ")}</Text>
                    <Text>🕒 Start: {new Date(item.startTime).toLocaleTimeString()}</Text>
                    <Text>🕒 End: {new Date(item.endTime).toLocaleTimeString()}</Text>
                    <Text>🛡 Radius: {item.location.radius} meters</Text>
                </View>
                )}
            />
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
        margin: 2,
        padding: 4,
        borderWidth: 1,
        borderRadius: 10,
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