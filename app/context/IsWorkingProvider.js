import React, { createContext, useState, useEffect, useContext } from "react";
import { useLocation } from "./LocationProvider";  // Get live location data
import { useWorkplace } from "./WorkplaceProvider"; // Get workplace data
import { haversineDistance } from "../utils/distanceCalculator"; 

// Create context
const IsWorkingContext = createContext();

// Provider
export const IsWorkingProvider = ({ children }) => {
    const { location } = useLocation();  // Get current user location
    const { workplaceData } = useWorkplace();  // Get workplace data
    const [isAtWork, setIsAtWork] = useState(false); // Whether the user is at the workplace
    const [isWithinWorkHours, setIsWithinWorkHours] = useState(false); // Whether the user is within work hours
    const [distanceToWorkplace, setDistanceToWorkplace] = useState(null); // Distance from workplace
    
    // Check if the user is at the workplace based on location and working hours
    useEffect(() => {
        if (location && workplaceData) {
            // Calculate the distance from the user to the workplace
            const distance = haversineDistance(
                workplaceData.location.latitude,
                workplaceData.location.longitude,
                location.latitude,
                location.longitude
            );
            setDistanceToWorkplace(distance);

            // Check if user is within the workplace radius
            const isAtWorkplace = distance < workplaceData.location.radius;
            setIsAtWork(isAtWorkplace);

            // Check if the user is within working hours
            checkWorkHours(workplaceData);
        }
    }, [location, workplaceData]);

    const checkWorkHours = (workplaceData) => {
        if (!workplaceData?.startTime || !workplaceData?.endTime || !workplaceData?.selectedDays) {
            setIsWithinWorkHours(false);
            return;
        }

        const now = new Date();
        const currentDay = now.toLocaleString("en-US", { weekday: "short" });

        if (!workplaceData.selectedDays.includes(currentDay)) {
            setIsWithinWorkHours(false);
            return;
        }

        const startTime = new Date(workplaceData.startTime);
        const endTime = new Date(workplaceData.endTime);

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
        <IsWorkingContext.Provider value={{ isAtWork, isWithinWorkHours, distanceToWorkplace }}>
            {children}
        </IsWorkingContext.Provider>
    );
};

// Custom Hook to use the IsWorking context
export const useIsWorking = () => useContext(IsWorkingContext);
