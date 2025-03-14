import React, { createContext, useState, useEffect, useContext } from "react";
import { useIsWorking } from "./IsWorkingProvider"; 
import useStepRangeData from "../hooks/useStepRangeData"; 
import { db } from "../api/firebase/firebaseConfig"; // Firestore instance
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
                .then((fetchedSteps) => {
                    console.log("📈 Steps fetched:", fetchedSteps);
                    setWorkHourSteps(fetchedSteps); // ✅ Update local state
                    storeDailySteps(user.uid, fetchedSteps, endTime); // ✅ Pass the correct step count to Firestore
                })
                .catch(error => console.error("❌ Step Fetch Error:", error));
        }
    }, [checkInTime, checkOutTime, user]); 

    // 🔄 Ensure Firestore gets the latest step count
    useEffect(() => {
        if (user && checkOutTime && steps !== null) {
            console.log("💾 Saving steps after checkout:", steps);
            storeDailySteps(user.uid, steps, checkOutTime);
        }
    }, [steps, checkOutTime, user]);

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
    const storeDailySteps = async (uid, stepCount, endTime) => {
        try {
            if (stepCount === null || stepCount === undefined) {
                console.warn("⚠️ Skipping Firestore save due to invalid step count");
                return;
            }

            const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
            const docRef = doc(db, "users", uid, "dailySteps", today);

            await setDoc(docRef, {
                date: today,
                steps: stepCount,  // ✅ Use fetched steps instead of workHourSteps
                timestamp: endTime.toISOString(),
            });

            console.log("💾 Steps saved to Firestore:", stepCount);
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
