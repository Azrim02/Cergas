import React, { createContext, useState, useEffect, useContext } from "react";
import { useLocation } from "./LocationProvider";  
import { useWorkplace } from "./WorkplaceProvider"; 
import { haversineDistance } from "../utils/distanceCalculator"; 
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { db } from "../api/firebaseConfig"; 
import { useAuth } from "../api/firebase/AuthProvider";
import { doc, setDoc, getDoc } from "firebase/firestore";

const IsWorkingContext = createContext();

export const IsWorkingProvider = ({ children }) => {
    const { user } = useAuth(); 
    const { location } = useLocation();
    const { workplaceData } = useWorkplace();
    
    const [isAtWork, setIsAtWork] = useState(false);
    const [isWithinWorkHours, setIsWithinWorkHours] = useState(false);
    const [distanceToWorkplace, setDistanceToWorkplace] = useState(null);
    const [checkInTime, setCheckInTime] = useState(null);
    const [checkOutTime, setCheckOutTime] = useState(null);

    useEffect(() => {
        if (user) {
            loadCheckTimes(user.uid);
        }
    }, [user]);

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

    // ✅ Load check-in and check-out times from Firestore & AsyncStorage
    const loadCheckTimes = async (uid) => {
        try {
            const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
            const docRef = doc(db, "users", uid, "workSession", today);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const { checkIn, checkOut } = docSnap.data();
                if (checkIn) {
                    setCheckInTime(new Date(checkIn));
                    await AsyncStorage.setItem("checkInTime", checkIn);
                }
                if (checkOut) {
                    setCheckOutTime(new Date(checkOut));
                    await AsyncStorage.setItem("checkOutTime", checkOut);
                }
                console.log("✅ Loaded check-in/out from Firestore.");
            } else {
                console.log("📭 No check-in data for today.");
                setCheckInTime(null);
                setCheckOutTime(null);
                await AsyncStorage.removeItem("checkInTime");
                await AsyncStorage.removeItem("checkOutTime");
            }
        } catch (error) {
            console.error("❌ Error loading check-in data:", error);
        }
    };

    // ✅ Save check-in & check-out times to Firestore
    const saveCheckTimesToFirestore = async (uid, checkIn, checkOut) => {
        try {
            const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
            const docRef = doc(db, "users", uid, "workSession", today);

            await setDoc(docRef, { checkIn, checkOut }, { merge: true });

            console.log("💾 Check-in/out saved to Firestore.");
        } catch (error) {
            console.error("❌ Error saving check-in data to Firestore:", error);
        }
    };

    // ✅ Convert workplace hours from UTC to Local Time
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

    // ✅ Handle check-in/out logic
    const handleCheckInOut = (isAtWork, isWithinWorkHours) => {
        if (!user) return;

        const now = new Date();
        const nowUTC = now.toISOString(); // Store in UTC

        // ✅ Check-in
        if (isAtWork && isWithinWorkHours && !checkInTime) {
            console.log("✅ User checked in at:", now.toLocaleTimeString());
            setCheckInTime(now);
            AsyncStorage.setItem("checkInTime", nowUTC);
            saveCheckTimesToFirestore(user.uid, nowUTC, null);
        }

        // ✅ Early Check-out (User leaves before office hours end)
        if (!isAtWork && checkInTime && !checkOutTime) {
            console.log("🚪 User checked out at:", now.toLocaleTimeString());
            setCheckOutTime(now);
            AsyncStorage.setItem("checkOutTime", nowUTC);
            saveCheckTimesToFirestore(user.uid, checkInTime.toISOString(), nowUTC);
        }

        // ✅ If the user returns after check-out, reset check-out time
        if (isAtWork && checkOutTime) {
            console.log("🔄 User returned after check-out at:", now.toLocaleTimeString());
            setCheckOutTime(null);
            AsyncStorage.removeItem("checkOutTime");
            saveCheckTimesToFirestore(user.uid, checkInTime.toISOString(), null);
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
