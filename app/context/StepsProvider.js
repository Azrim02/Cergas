import React, { createContext, useState, useEffect, useContext } from "react";
import { useIsWorking } from "./IsWorkingProvider"; 
import useStepRangeData from "../hooks/useStepRangeData"; 
import { db } from "../api/firebaseConfig"; // Firestore instance
import { useAuth } from "../api/firebase/AuthProvider"; // Import Auth Provider to get user info
import { doc, setDoc, getDoc } from "firebase/firestore"; 

const StepsContext = createContext();

export const StepsProvider = ({ children }) => {
    const { user } = useAuth(); // Get current user
    const { checkInTime, checkOutTime } = useIsWorking(); 
    const [workHourSteps, setWorkHourSteps] = useState(0);
    const { steps, stepEntries, fetchStepsForCheckInOut } = useStepRangeData(); 

    // ✅ Load previous step count from Firestore when the app starts
    useEffect(() => {
        if (user) {
            loadSavedSteps(user.uid);
        }
    }, [user]);

    // 🔄 Fetch steps when check-in or check-out time changes
    useEffect(() => {
        if (user && checkInTime) {
            const startTime = checkInTime;
            const endTime = checkOutTime || new Date(); // If no check-out, use current time

            console.log(`📊 Fetching steps from ${startTime.toLocaleTimeString()} to ${endTime.toLocaleTimeString()}`);

            fetchStepsForCheckInOut(startTime, endTime)
                .then(() => storeDailySteps(user.uid, endTime)) // ✅ Save steps to Firestore
                .catch(error => console.error("❌ Step Fetch Error:", error));
        }
    }, [checkInTime, checkOutTime, user]); 

    // ✅ Load saved steps from Firestore
    const loadSavedSteps = async (uid) => {
        try {
            const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
            const docRef = doc(db, "users", uid, "dailySteps", today);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const stepData = docSnap.data();
                setWorkHourSteps(stepData.steps || 0);
                console.log("✅ Loaded steps from Firestore:", stepData.steps);
            } else {
                console.log("📭 No step data for today, starting fresh.");
                setWorkHourSteps(0);
            }
        } catch (error) {
            console.error("❌ Error loading steps from Firestore:", error);
        }
    };

    // ✅ Save the user's step data to Firestore
    const storeDailySteps = async (uid, endTime) => {
        try {
            const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
            const docRef = doc(db, "users", uid, "dailySteps", today);

            await setDoc(docRef, {
                date: today,
                steps: workHourSteps,
                timestamp: endTime.toISOString(),
            });

            console.log("💾 Steps saved to Firestore:", workHourSteps);
        } catch (error) {
            console.error("❌ Error saving steps to Firestore:", error);
        }
    };

    return (
        <StepsContext.Provider value={{ workHourSteps, stepEntries, fetchStepsForCheckInOut }}> 
            {children}
        </StepsContext.Provider>
    );
};

export const useSteps = () => useContext(StepsContext);
