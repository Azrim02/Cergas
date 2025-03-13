import { useState, useEffect, useCallback } from "react";
import { initialize, requestPermission, readRecords } from "react-native-health-connect";
import { useIsWorking } from "../context/IsWorkingProvider";
import { useAuth } from "../api/firebase/AuthProvider";
import { db } from "../api/firebase/firebaseConfig";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

const useStepData = () => {
    const { isWorking } = useIsWorking(); // Get working status
    const { user } = useAuth(); // Get authenticated user
    const [steps, setSteps] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [stepDocRef, setStepDocRef] = useState(null);

    useEffect(() => {
        if (user) {
            const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
            const docRef = doc(db, `users/${user.uid}/steps`, today);
            setStepDocRef(docRef);

            // Subscribe to Firestore updates
            const unsubscribe = onSnapshot(docRef, (docSnap) => {
                if (docSnap.exists()) {
                    setSteps(docSnap.data().stepCount || 0);
                }
            });

            return () => unsubscribe();
        }
    }, [user]);

    const fetchStepData = useCallback(async () => {
        if (!isWorking || !stepDocRef) return; // Fetch steps only when user is working

        setLoading(true);
        setError(null);

        try {
            console.log("🔹 Initializing Health Connect...");
            const isInitialized = await initialize();
            if (!isInitialized) {
                setError("Failed to initialize Health Connect");
                console.error("Failed to initialize Health Connect");
                setLoading(false);
                return;
            }

            console.log("🔹 Requesting permissions for Steps...");
            const grantedPermissions = await requestPermission([
                { accessType: "read", recordType: "Steps" },
            ]);
            if (!grantedPermissions) {
                setError("Permission denied");
                console.error("Permission denied");
                setLoading(false);
                return;
            }

            console.log("🔹 Reading step records...");
            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

            const { records } = await readRecords("Steps", {
                timeRangeFilter: {
                    operator: "between",
                    startTime: startOfDay,
                    endTime: now.toISOString(),
                },
            });

            const totalSteps = records.reduce((sum, record) => sum + (record.count || 0), 0);
            console.log("📊 Total Steps Today (Working Hours):", totalSteps);
            setSteps(totalSteps);

            // Store in Firestore
            await setDoc(
                stepDocRef,
                {
                    date: startOfDay.split("T")[0],
                    stepCount: totalSteps,
                    lastUpdated: now.toISOString(),
                },
                { merge: true }
            );
        } catch (err) {
            setError(err.message);
            console.error("❌ Error fetching step data:", err);
        } finally {
            setLoading(false);
        }
    }, [isWorking, stepDocRef]);

    useEffect(() => {
        if (isWorking) {
            fetchStepData(); // Trigger aggregation only when the user is working
        }
    }, [isWorking]);

    return { steps, error, loading, fetchStepData };
};

export default useStepData;
