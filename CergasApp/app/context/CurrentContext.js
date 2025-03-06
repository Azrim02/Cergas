import React, { createContext, useState, useEffect, useContext } from "react";
import { useLocation } from "./LocationContext";  // Get live location updates
import { useWorkplace } from "./WorkplaceContext"; // Get workplace data
import { haversineDistance } from "../utils/distanceCalculator";

const CurrentContext = createContext();

export const CurrentProvider = ({ children }) => {
    const { location } = useLocation();  // Get current user location
    const { workplaceData } = useWorkplace(); // Get saved workplace location
    const [distanceToWorkplace, setDistanceToWorkplace] = useState(null);
    const [isAtWork, setIsAtWork] = useState(false);

    useEffect(() => {
        if (location && workplaceData?.location) {
            const distance = haversineDistance(
                workplaceData.location.latitude,
                workplaceData.location.longitude,
                location.latitude,
                location.longitude
            );
            setDistanceToWorkplace(distance);
            setIsAtWork(distance < 100); // Consider "at work" if within 100m
        }
    }, [location, workplaceData]);

    return (
        <CurrentContext.Provider value={{ distanceToWorkplace, isAtWork }}>
            {children}
        </CurrentContext.Provider>
    );
};

// Custom Hook to use this context
export const useCurrent = () => useContext(CurrentContext);
