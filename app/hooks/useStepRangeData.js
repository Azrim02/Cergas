import { useState, useCallback } from "react";
import { initialize, requestPermission, readRecords } from "react-native-health-connect";

const useStepRangeData = () => {
    const [steps, setSteps] = useState(null);
    const [stepEntries, setStepEntries] = useState([]); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchStepsForTimeRanges = useCallback(async (timeRanges) => {
        if (!timeRanges || timeRanges.length === 0) return;

        setLoading(true);
        setError(null);
        setSteps(null);
        setStepEntries([]);

        try {
            const isInitialized = await initialize();
            if (!isInitialized) throw new Error("Failed to initialize Health Connect");

            const grantedPermissions = await requestPermission([{ accessType: "read", recordType: "Steps" }]);
            if (!grantedPermissions) throw new Error("Permission denied");

            let totalSteps = 0;
            let entries = [];

            for (const { startTime, endTime } of timeRanges) {
                const { records } = await readRecords("Steps", {
                    timeRangeFilter: {
                        operator: "between",
                        startTime: new Date(startTime).toISOString(),
                        endTime: new Date(endTime).toISOString(),
                    },
                });

                totalSteps += records.reduce((sum, record) => sum + (record.count || 0), 0);
                entries = [...entries, ...records]; // Store detailed step records
            }

            setSteps(totalSteps);
            setStepEntries(entries);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    return { steps, stepEntries, error, loading, fetchStepsForTimeRanges };
};

export default useStepRangeData;
