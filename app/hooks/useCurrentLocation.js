import { useState, useEffect } from "react";
import * as Location from "expo-location";

export const useCurrentLocation = () => {
    const[currentLocation, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                // Request location permission
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    setErrorMsg("Permission to access location was denied");
                    setLoading(false);
                    return;
                }

                // Get current location
                let currentLocation = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });

                setLocation({
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude,
                });
            } catch (error) {
                console.error("Error fetching location:", error);
                setErrorMsg("Failed to fetch location");
            } finally {
                setLoading(false);
            }
        };

        fetchLocation();
    }, []);

    return { currentLocation, errorMsg, loading };
};
