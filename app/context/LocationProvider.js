import React, { createContext, useState, useEffect, useContext } from "react";
import * as TaskManager from 'expo-task-manager'
import * as Location from 'expo-location';

const LocationContext = createContext();
const LOCATION_TRACKING = "background-location-task";

TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
    if (error) {
        console.error("Background location error:", error);
        return;
    }

    if (data) {
        const { locations } = data;
        console.log("📍 Background Location:", locations);
    }
});

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    // Fetch user's location when app is active
    useEffect(() => {
        const fetchLocation = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
                return;
            }

            const userLocation = await Location.getCurrentPositionAsync({});
            setLocation(userLocation.coords);
        };

        fetchLocation();
    }, []);

    // Start background location tracking
    useEffect(() => {
        const startBackgroundLocation = async () => {
            const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING);
            if (hasStarted) {
                console.log("🚀 Background location tracking already started");
                return;
            }
    
            await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
                accuracy: Location.Accuracy.High,
                distanceInterval: 50, // Update every 50 meters
                deferredUpdatesInterval: 60000, // Update every 60 seconds
                showsBackgroundLocationIndicator: true,
            });
    
            console.log("✅ Background location tracking started!");
        };
    
        startBackgroundLocation();
    }, []);
    

    return (
        <LocationContext.Provider value={{ location, errorMsg }}>
            {children}
        </LocationContext.Provider>
    );
};

// Custom Hook
export const useLocation = () => useContext(LocationContext);
