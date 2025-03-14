import { useState, useCallback } from "react";
import { initialize, requestPermission, readRecords } from "react-native-health-connect";

const useHeartRateData = () => {
    const [heartRateData, setHeartRateData] = useState([]);
    const [restingHeartRate, setRestingHeartRate] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // ✅ Fetch Heart Rate Data (Resting HR)
    const fetchHeartRateForCheckInOut = useCallback(async (checkInTime, checkOutTime) => {
        if (!checkInTime) return []; // Ensure function returns an array
    
        setLoading(true);
        setError(null);
    
        const startTime = new Date(checkInTime);
        const endTime = checkOutTime ? new Date(checkOutTime) : new Date();
    
        try {
            console.log(`💓 Fetching heart rate from ${startTime.toLocaleTimeString()} to ${endTime.toLocaleTimeString()}`);
    
            const isInitialized = await initialize();
            if (!isInitialized) throw new Error("Failed to initialize Health Connect");
    
            const grantedPermissions = await requestPermission([{ accessType: "read", recordType: "HeartRate" }]);
            if (!grantedPermissions) throw new Error("Permission denied");
    
            const { records } = await readRecords("HeartRate", {
                timeRangeFilter: {
                    operator: "between",
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                },
            });
    
            console.log("💓 Raw Heart Rate Records Fetched:", records);
    
            return records; // ✅ Fix: Ensure function explicitly returns heart rate records
        } catch (err) {
            console.error("❌ Heart Rate Fetch Error:", err);
            setError(err.message);
            return []; // Fix: Ensure function returns an empty array instead of undefined
        } finally {
            setLoading(false);
        }
    }, []);
    
    
    

    return { heartRateData, restingHeartRate, error, loading, fetchHeartRateForCheckInOut };
};

export default useHeartRateData;
