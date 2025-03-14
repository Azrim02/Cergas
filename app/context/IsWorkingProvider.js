import React, { createContext, useState, useEffect, useContext } from "react";
import { useLocation } from "./LocationProvider";  
import { useWorkplace } from "./WorkplaceProvider"; 
import { haversineDistance } from "../utils/distanceCalculator"; 
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const IsWorkingContext = createContext();

export const IsWorkingProvider = ({ children }) => {
    const { location } = useLocation();
    const { workplaceData } = useWorkplace();
    const [isAtWork, setIsAtWork] = useState(false);
    const [isWithinWorkHours, setIsWithinWorkHours] = useState(false);
    const [distanceToWorkplace, setDistanceToWorkplace] = useState(null);
    const [checkInTime, setCheckInTime] = useState(null);
    const [checkOutTime, setCheckOutTime] = useState(null);

    // 🔄 Load check-in and check-out times when the app starts
    useEffect(() => {
        loadCheckTimesFromStorage();
    }, []);

    useEffect(() => {
        if (!location || !workplaceData) return;

        const distance = haversineDistance(
            workplaceData.location.latitude,
            workplaceData.location.longitude,
            location.latitude,
            location.longitude
        );
        setDistanceToWorkplace(distance);

        const isAtWorkplace = distance < workplaceData.location.radius;
        setIsAtWork(isAtWorkplace);

        checkWorkHours(workplaceData);

        handleCheckInOut(isAtWorkplace, isWithinWorkHours);
    }, [location, workplaceData]);

    // ✅ Load check-in and check-out times from AsyncStorage
    const loadCheckTimesFromStorage = async () => {
        try {
            const storedCheckIn = await AsyncStorage.getItem("checkInTime");
            const storedCheckOut = await AsyncStorage.getItem("checkOutTime");
            const today = new Date();

            if (storedCheckIn) {
                const checkInDate = new Date(storedCheckIn);
                if (checkInDate.toDateString() === today.toDateString()) {
                    setCheckInTime(checkInDate);
                    console.log("✅ Loaded check-in time:", checkInDate.toLocaleTimeString());
                } else {
                    await AsyncStorage.removeItem("checkInTime");
                    setCheckInTime(null); // Reset if it's a new day
                }
            }

            if (storedCheckOut) {
                const checkOutDate = new Date(storedCheckOut);
                if (checkOutDate.toDateString() === today.toDateString()) {
                    setCheckOutTime(checkOutDate);
                    console.log("✅ Loaded check-out time:", checkOutDate.toLocaleTimeString());
                } else {
                    await AsyncStorage.removeItem("checkOutTime");
                    setCheckOutTime(null); // Reset if it's a new day
                }
            }
        } catch (error) {
            console.error("❌ Error loading check times:", error);
        }
    };

    // ✅ Save check-in time to AsyncStorage
    const saveCheckInToStorage = async (timestamp) => {
        try {
            await AsyncStorage.setItem("checkInTime", timestamp.toISOString());
            console.log("💾 Check-in time saved:", timestamp.toLocaleTimeString());
        } catch (error) {
            console.error("❌ Error saving check-in:", error);
        }
    };

    // ✅ Save check-out time to AsyncStorage
    const saveCheckOutToStorage = async (timestamp) => {
        try {
            await AsyncStorage.setItem("checkOutTime", timestamp.toISOString());
            console.log("💾 Check-out time saved:", timestamp.toLocaleTimeString());
        } catch (error) {
            console.error("❌ Error saving check-out:", error);
        }
    };

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

        setIsWithinWorkHours(currentTimeUTC >= startTimeUTC && currentTimeUTC <= endTimeUTC);
    };

    const handleCheckInOut = (isAtWork, isWithinWorkHours) => {
        const now = new Date();
        const endTime = new Date(workplaceData.endTime);
        endTime.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());

        // ✅ Check-in logic
        if (isAtWork && isWithinWorkHours && !checkInTime) {
            console.log("✅ User checked in at:", now.toLocaleTimeString());
            setCheckInTime(now);
            saveCheckInToStorage(now);
        }

        // ✅ Early check-out: If user leaves the workplace, even if office hours haven't ended
        if (!isAtWork && checkInTime && !checkOutTime) {
            console.log("🚪 User checked out at:", now.toLocaleTimeString());
            setCheckOutTime(now);
            saveCheckOutToStorage(now);
        }

        // ✅ If the user returns after check-out, reset check-out time to the latest time
        if (isAtWork && checkOutTime) {
            console.log("🔄 User returned after check-out at:", now.toLocaleTimeString());
            setCheckOutTime(null);
            saveCheckOutToStorage(now);
        }
    };

    return (
        <IsWorkingContext.Provider value={{ 
            isAtWork, 
            isWithinWorkHours, 
            distanceToWorkplace, 
            checkInTime, 
            checkOutTime 
        }}>
            {children}
        </IsWorkingContext.Provider>
    );
};

export const useIsWorking = () => useContext(IsWorkingContext);
