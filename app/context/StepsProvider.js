import React, { createContext, useState, useEffect, useContext } from "react";
import { useLocation } from "./LocationProvider";  
import { useWorkplace } from "./WorkplaceProvider"; 
import { haversineDistance } from "../utils/distanceCalculator"; 
import AsyncStorage from "@react-native-async-storage/async-storage"; 

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

    const loadCheckTimesFromStorage = async () => {
        try {
            const storedCheckIn = await AsyncStorage.getItem("checkInTime");
            const storedCheckOut = await AsyncStorage.getItem("checkOutTime");
            const today = new Date().toDateString(); // Current day in local time

            if (storedCheckIn) {
                const checkInDateUTC = new Date(storedCheckIn);
                const checkInDateLocal = new Date(checkInDateUTC.toLocaleString("en-US", { timeZone: "UTC" }));

                if (checkInDateLocal.toDateString() === today) {
                    setCheckInTime(checkInDateLocal);
                    console.log("✅ Loaded check-in time (local):", checkInDateLocal.toLocaleTimeString());
                } else {
                    await AsyncStorage.removeItem("checkInTime");
                    setCheckInTime(null);
                }
            }

            if (storedCheckOut) {
                const checkOutDateUTC = new Date(storedCheckOut);
                const checkOutDateLocal = new Date(checkOutDateUTC.toLocaleString("en-US", { timeZone: "UTC" }));

                if (checkOutDateLocal.toDateString() === today) {
                    setCheckOutTime(checkOutDateLocal);
                    console.log("✅ Loaded check-out time (local):", checkOutDateLocal.toLocaleTimeString());
                } else {
                    await AsyncStorage.removeItem("checkOutTime");
                    setCheckOutTime(null);
                }
            }
        } catch (error) {
            console.error("❌ Error loading check times:", error);
        }
    };

    const saveCheckInToStorage = async (timestamp) => {
        try {
            await AsyncStorage.setItem("checkInTime", timestamp.toISOString());
            console.log("💾 Check-in time saved (local):", timestamp.toLocaleTimeString());
        } catch (error) {
            console.error("❌ Error saving check-in:", error);
        }
    };

    const saveCheckOutToStorage = async (timestamp) => {
        try {
            await AsyncStorage.setItem("checkOutTime", timestamp.toISOString());
            console.log("💾 Check-out time saved (local):", timestamp.toLocaleTimeString());
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

        const startTimeUTC = new Date(workplaceData.startTime);
        const endTimeUTC = new Date(workplaceData.endTime);

        const startTimeLocal = new Date(startTimeUTC.toLocaleString("en-US", { timeZone: "UTC" }));
        const endTimeLocal = new Date(endTimeUTC.toLocaleString("en-US", { timeZone: "UTC" }));

        const currentTimeLocal = now.getHours() * 60 + now.getMinutes();
        const startTimeMinutes = startTimeLocal.getHours() * 60 + startTimeLocal.getMinutes();
        const endTimeMinutes = endTimeLocal.getHours() * 60 + endTimeLocal.getMinutes();

        setIsWithinWorkHours(currentTimeLocal >= startTimeMinutes && currentTimeLocal <= endTimeMinutes);
    };

    const handleCheckInOut = (isAtWork, isWithinWorkHours) => {
        const now = new Date();
        const endTimeUTC = new Date(workplaceData.endTime);
        const endTimeLocal = new Date(endTimeUTC.toLocaleString("en-US", { timeZone: "UTC" }));

        // ✅ Check-in logic
        if (isAtWork && isWithinWorkHours && !checkInTime) {
            console.log("✅ User checked in at:", now.toLocaleTimeString());
            setCheckInTime(now);
            saveCheckInToStorage(now);
        }

        if (!isAtWork && checkInTime && !checkOutTime) {
            console.log("🚪 User checked out at:", now.toLocaleTimeString());
            setCheckOutTime(now);
            saveCheckOutToStorage(now);
        }

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
