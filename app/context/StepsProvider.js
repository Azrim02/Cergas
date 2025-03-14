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

    // ✅ Load previous step count & check-in/out times from Firestore when the app starts
    useEffect(() => {
        if (user) {
            loadSavedWorkSession(user.uid);
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
                    storeDailyWorkSession(user.uid, fetchedSteps, startTime, endTime); // ✅ Save all data to Firestore
                })
                .catch(error => console.error("❌ Step Fetch Error:", error));
        }
    }, [checkInTime, checkOutTime, user]); 

    // 🔄 Ensure Firestore gets the latest step count
    useEffect(() => {
        if (user && checkOutTime && steps !== null) {
            console.log("💾 Saving steps after checkout:", steps);
            storeDailyWorkSession(user.uid, steps, checkInTime, checkOutTime);
        }
    }, [steps, checkOutTime, user]);

    // ✅ Load saved step data & check-in/out times from Firestore
    const loadSavedWorkSession = async (uid) => {
        try {
            const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
            const docRef = doc(db, "users", uid, "dailySteps", today);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const sessionData = docSnap.data();
                setWorkHourSteps(sessionData.steps || 0);
                console.log("✅ Loaded steps from Firestore:", sessionData.steps);

                if (sessionData.checkIn) {
                    console.log("✅ Loaded check-in time from Firestore:", new Date(sessionData.checkIn).toLocaleTimeString());
                }
                if (sessionData.checkOut) {
                    console.log("✅ Loaded check-out time from Firestore:", new Date(sessionData.checkOut).toLocaleTimeString());
                }
            } else {
                console.log("📭 No work session data for today, starting fresh.");
                setWorkHourSteps(0);
            }
        } catch (error) {
            console.error("❌ Error loading work session from Firestore:", error);
        }
    };

    // ✅ Save the user's work session data (Steps + Check-in/out times) to Firestore
    const storeDailyWorkSession = async (uid, stepCount, checkIn, checkOut) => {
        try {
            if (!checkIn) {
                console.warn("⚠️ Skipping Firestore save due to missing check-in time.");
                return;
            }

            const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
            const docRef = doc(db, "users", uid, "dailySteps", today);

            await setDoc(docRef, {
                date: today,
                steps: stepCount || 0,  // ✅ Use fetched steps instead of workHourSteps
                checkIn: checkIn.toISOString(),
                checkOut: checkOut ? checkOut.toISOString() : null, // ✅ Save check-out if available
                timestamp: new Date().toISOString(),
            }, { merge: true });

            console.log("💾 Work session saved to Firestore:", { steps: stepCount, checkIn, checkOut });
        } catch (error) {
            console.error("❌ Error saving work session to Firestore:", error);
        }
    };

    return (
        <StepsContext.Provider value={{ workHourSteps, stepEntries, fetchStepsForCheckInOut }}> 
            {children}
        </StepsContext.Provider>
    );
};

export const useSteps = () => useContext(StepsContext);
