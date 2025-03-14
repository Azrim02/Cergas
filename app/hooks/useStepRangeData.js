import { useState, useCallback } from "react";
import { initialize, requestPermission, readRecords } from "react-native-health-connect";

const useStepRangeData = () => {
    const [steps, setSteps] = useState(null);
    const [stepEntries, setStepEntries] = useState([]); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // ✅ Fix: Ensure correct function dependency management
    const fetchStepsForCheckInOut = useCallback(async (checkInTime, checkOutTime) => {
        if (!checkInTime) return; // No check-in means no steps to fetch

        setLoading(true);
        setError(null);
        setSteps(null);
        setStepEntries([]);

        const startTime = new Date(checkInTime);
        const endTime = checkOutTime ? new Date(checkOutTime) : new Date(); // If no check-out, use current time

        try {
            console.log(`📊 Fetching steps from ${startTime.toLocaleTimeString()} to ${endTime.toLocaleTimeString()}`);

            const isInitialized = await initialize();
            if (!isInitialized) throw new Error("Failed to initialize Health Connect");

            const grantedPermissions = await requestPermission([{ accessType: "read", recordType: "Steps" }]);
            if (!grantedPermissions) throw new Error("Permission denied");

            const { records } = await readRecords("Steps", {
                timeRangeFilter: {
                    operator: "between",
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                },
            });

            const totalSteps = records.reduce((sum, record) => sum + (record.count || 0), 0);
            setSteps(totalSteps);
            setStepEntries(records);

            console.log(`📈 Steps from ${startTime.toLocaleTimeString()} to ${endTime.toLocaleTimeString()}: ${totalSteps}`);
        } catch (err) {
            console.error("❌ Step Fetch Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []); // ✅ Fix: No unnecessary dependencies

    return { steps, stepEntries, error, loading, fetchStepsForCheckInOut };
};

export default useStepRangeData;
