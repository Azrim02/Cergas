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
    const [isWithinWorkHours, setIsWithinWorkHours] = useState(false);


    useEffect(() => {
        if (workplaceData) {
            checkWorkHours();
        }
    }, [workplaceData]);
    
    useEffect(() => {
        if (location && workplaceData?.location) {
            const distance = haversineDistance(
                workplaceData.location.latitude,
                workplaceData.location.longitude,
                location.latitude,
                location.longitude
            );
            setDistanceToWorkplace(distance);
            setIsAtWork(distance < workplaceData.location.radius); // Consider "at work" if within radius
        }
    }, [location, workplaceData]);


    // Function to check if user is within work hours
    const checkWorkHours = () => {
        if (!workplaceData?.startTime || !workplaceData?.endTime || !workplaceData?.selectedDays) return;

        const now = new Date();
        const currentDay = now.toLocaleString("en-US", { weekday: "short" }); // Get "Tue", "Wed", etc.

        if (!workplaceData.selectedDays.includes(currentDay)) {
            setIsWithinWorkHours(false);
            return;
        }

        const startTime = new Date(workplaceData.startTime);
        const endTime = new Date(workplaceData.endTime);

        // Convert current time to UTC
        const currentTimeUTC = now.getUTCHours() * 60 + now.getUTCMinutes();
        const startTimeUTC = startTime.getUTCHours() * 60 + startTime.getUTCMinutes();
        const endTimeUTC = endTime.getUTCHours() * 60 + endTime.getUTCMinutes();

        if (currentTimeUTC >= startTimeUTC && currentTimeUTC <= endTimeUTC) {
            setIsWithinWorkHours(true);
        } else {
            setIsWithinWorkHours(false);
        }
    };

    return (
        <CurrentContext.Provider value={{ distanceToWorkplace, isAtWork, isWithinWorkHours }}>
            {children}
        </CurrentContext.Provider>
    );
};

// Custom Hook to use this context
export const useCurrent = () => useContext(CurrentContext);