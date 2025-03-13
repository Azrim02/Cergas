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
    const [isTracking, setIsTracking] = useState(false);

    // Request foreground and background permissions
    useEffect(() => {
        const requestPermissions = async () => {
            const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
            if (foregroundStatus !== "granted") {
                setErrorMsg("Permission to access location was denied");
                return;
            }

            const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
            if (backgroundStatus !== "granted") {
                console.error("Background location permission denied.");
                return;
            }

            console.log("✅ Foreground and Background location permissions granted!");
            fetchCurrentLocation();
            startBackgroundLocation();
        };

        requestPermissions();
    }, []);

    // Fetch user's current location when app is active
    const fetchCurrentLocation = async () => {
        try {
            const userLocation = await Location.getCurrentPositionAsync({});
            setLocation(userLocation.coords);
            console.log("📍 Current Location:", userLocation.coords);
        } catch (error) {
            console.error("Error fetching current location:", error);
        }
    };

    // Start background location tracking
    const startBackgroundLocation = async () => {
        try {
            const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING);
            if (hasStarted) {
                console.log("🚀 Background location tracking already running");
                return;
            }

            await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
                accuracy: Location.Accuracy.High,
                distanceInterval: 50, // Update every 50 meters
                timeInterval: 60000, // Update every 60 seconds
                showsBackgroundLocationIndicator: true,
                foregroundService: {
                    notificationTitle: "Tracking Location",
                    notificationBody: "Your location is being tracked in the background",
                },
            });
            
            setIsTracking(true);
            console.log("✅ Background location tracking started!");
        } catch (error) {
            console.error("Error starting background location tracking:", error);
        }
    };
    

    return (
        <LocationContext.Provider value={{ location, errorMsg, isTracking }}>
            {children}
        </LocationContext.Provider>
    );
};

// Custom Hook
export const useLocation = () => useContext(LocationContext);
