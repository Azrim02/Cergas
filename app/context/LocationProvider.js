import React, { createContext, useState, useEffect, useContext } from "react";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { useKeepAwake } from 'expo-keep-awake';

const LOCATION_TRACKING = "background-location-task";
const LocationContext = createContext();

TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
    if (error) {
        console.error("Background location error:", error);
        return;
    }

    if (data) {
        const { locations } = data;
        if (locations?.length) {
            console.log(`📍 Background Location Update: ${new Date().toLocaleTimeString()} →`, locations[0].coords);
            LocationProviderInstance.setLocation(locations[0].coords);
        }
    }
});

// Singleton to update location state outside of React
export const LocationProviderInstance = {
    setLocation: () => {},
};

export const LocationProvider = ({ children }) => {
    useKeepAwake();
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isTracking, setIsTracking] = useState(false);

    // Ensure background task updates `location`
    useEffect(() => {
        LocationProviderInstance.setLocation = setLocation;
    }, []);

    // Request permissions and check if task is running
    useEffect(() => {
        const setupLocationTracking = async () => {
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

            // Check if background task is registered
            const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TRACKING);
            console.log("📌 Is Background Task Registered?", isTaskRegistered);

            if (!isTaskRegistered) {
                console.log("🚀 Registering background task...");
                await startBackgroundLocation(); // Start tracking if not already running
            } else {
                console.log("🔄 Background task already registered.");
            }

            fetchCurrentLocation(); // Also get current location
        };

        setupLocationTracking();
    }, []);

    // Fetch user's current location
    const fetchCurrentLocation = async () => {
        try {
            const userLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
                mayShowUserInterface: true,
            });
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
                accuracy: Location.Accuracy.Balanced,
                timeInterval: 5000, 
                distanceInterval: 10, 
                pausesUpdatesAutomatically: false,
                deferredUpdatesInterval: 15000, 
                deferredUpdatesDistance: 20, 
                foregroundService: {
                    notificationTitle: "Tracking Location",
                    notificationBody: "Your location is being tracked in the background",
                    killServiceOnDestroy: false,
                },
            });
    
            const trackingStatus = await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING);
            setIsTracking(trackingStatus);
            console.log("✅ Background location tracking started!", trackingStatus);
        } catch (error) {
            console.error("Error starting background location tracking:", error);
        }
    };

    // Stop background location tracking
    const stopBackgroundLocation = async () => {
        try {
            const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TRACKING);
            if (isTaskRegistered) {
                await Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
                console.log("🚫 Background location tracking stopped.");
            }
            setIsTracking(false);
        } catch (error) {
            console.error("Error stopping background location tracking:", error);
        }
    };

    return (
        <LocationContext.Provider value={{ location, errorMsg, isTracking, startBackgroundLocation, stopBackgroundLocation }}>
            {children}
        </LocationContext.Provider>
    );
};

// Custom Hook
export const useLocation = () => useContext(LocationContext);
