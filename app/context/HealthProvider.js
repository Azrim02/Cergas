import React, { createContext, useState, useEffect, useContext } from "react";
import { useIsWorking } from "./IsWorkingProvider"; 
import useStepRangeData from "../hooks/useStepRangeData"; 
import useHeartRateData from "../hooks/useHeartRateData";
import { db } from "../api/firebase/firebaseConfig"; 
import { useAuth } from "../api/firebase/AuthProvider"; 
import { doc, setDoc, getDoc } from "firebase/firestore"; 

const HealthContext = createContext();

export const HealthProvider = ({ children }) => {
    const { user } = useAuth(); // Get current user
    const { checkInTime, checkOutTime } = useIsWorking(); 
    const [workHourSteps, setWorkHourSteps] = useState(0);
    const [restingHeartRate, setRestingHeartRate] = useState(0);
    const [heartRateEntries, setHeartRateEntries] = useState([]);
    const { steps, stepEntries, fetchStepsForCheckInOut } = useStepRangeData(); 
    const { heartRateData, fetchHeartRateForCheckInOut } = useHeartRateData(); 

    // ✅ Load previous health data from Firestore when the app starts
    useEffect(() => {
        if (user) {
            loadSavedHealthSession(user.uid);
        }
    }, [user]);

    // 🔄 Fetch steps & heart rate when check-in or check-out time changes
    useEffect(() => {
        if (user && checkInTime) {
            const startTime = checkInTime;
            const endTime = checkOutTime || new Date();

            console.log(`📊 Fetching steps & heart rate from ${startTime.toLocaleTimeString()} to ${endTime.toLocaleTimeString()}`);

            fetchHealthData(startTime, endTime);
        }
    }, [checkInTime, checkOutTime, user]); 

    // Fetch Steps & Resting HR Data
    const fetchHealthData = async (startTime, endTime) => {
        try {
            console.log(`📊 Fetching steps & heart rate from ${startTime.toLocaleTimeString()} to ${endTime.toLocaleTimeString()}`);
    
            // Fetch Steps
            const totalSteps = await fetchStepsForCheckInOut(startTime, endTime);
            console.log("📈 DEBUG: Step Data Returned:", totalSteps);
    
            // Fetch Heart Rate
            const heartRateRecords = await fetchHeartRateForCheckInOut(startTime, endTime);
            console.log("💓 DEBUG: Heart Rate Data Returned:", heartRateRecords);
    
            if (totalSteps === undefined || heartRateRecords === undefined) {
                console.error("❌ Error: Steps or Heart Rate returned undefined.");
                return;
            }
    
            // Extract BPM values
            const bpmValues = heartRateRecords
                .flatMap(record => record.samples?.map(sample => sample.beatsPerMinute) || [])
                .filter(bpm => bpm !== undefined && bpm !== null);
            
            // Extract BPM entries from records
            const bpmEntries = heartRateRecords.flatMap(record => 
                record.samples.map(sample => ({
                    bpm: sample.beatsPerMinute,
                    time: sample.time, // Store timestamp
                }))
            );

            // Calculate RHR
            const restingHR = bpmValues.length > 0 ? Math.min(...bpmValues) : 0;
            console.log(`💓 Computed Resting HR: ${restingHR}`);
            
            console.log("💓 Processed BPM Entries:", bpmEntries);

            setHeartRateEntries(bpmEntries); // Save BPM entries

            // Update state
            setWorkHourSteps(totalSteps);
            setRestingHeartRate(restingHR);
    
            // Save to Firestore
            storeDailyHealthSession(user.uid, totalSteps, restingHR, startTime, endTime);
        } catch (error) {
            console.error("❌ Health Data Fetch Error:", error);
        }
    };

    // ✅ Load saved health session data from Firestore
    const loadSavedHealthSession = async (uid) => {
        try {
            const today = new Date().toISOString().split("T")[0];
            const docRef = doc(db, "users", uid, "dailyHealth", today);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const sessionData = docSnap.data();
                setWorkHourSteps(sessionData.steps || 0);
                setRestingHeartRate(sessionData.restingHeartRate || 0);
                console.log("✅ Loaded health data from Firestore:", sessionData);
            } else {
                console.log("📭 No health data for today, starting fresh.");
                setWorkHourSteps(0);
                setRestingHeartRate(0);
            }
        } catch (error) {
            console.error("❌ Error loading health session from Firestore:", error);
        }
    };

    // ✅ Save health session data (Steps + Resting HR) to Firestore
    const storeDailyHealthSession = async (uid, stepCount, restingHR, checkIn, checkOut) => {
        try {
            if (!checkIn) {
                console.warn("⚠️ Skipping Firestore save due to missing check-in time.");
                return;
            }

            const today = new Date().toISOString().split("T")[0];
            const docRef = doc(db, "users", uid, "dailyHealth", today);

            await setDoc(docRef, {
                date: today,
                steps: stepCount || 0,  
                restingHeartRate: restingHR,
                checkIn: checkIn.toISOString(),
                checkOut: checkOut ? checkOut.toISOString() : null, 
                timestamp: new Date().toISOString(),
            }, { merge: true });

            console.log("💾 Health session saved to Firestore:", { steps: stepCount, restingHR, checkIn, checkOut });
        } catch (error) {
            console.error("❌ Error saving health session to Firestore:", error);
        }
    };

    return (
        <HealthContext.Provider value={{ workHourSteps, restingHeartRate, stepEntries, heartRateEntries, fetchStepsForCheckInOut, fetchHeartRateForCheckInOut }}> 
            {children}
        </HealthContext.Provider>
    );
};

export const useHealth = () => useContext(HealthContext);
