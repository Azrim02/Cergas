import { useState, useCallback } from 'react';
import { initialize, requestPermission, readRecords } from 'react-native-health-connect';

const useStepRangeData = (initialTimeRanges = []) => {
    const [steps, setSteps] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchStepsForTimeRanges = useCallback(async (timeRanges = initialTimeRanges) => {
        setLoading(true);
        setError(null);
        setSteps(null);
        try {
            console.log("Initializing Health Connect...");
            const isInitialized = await initialize();
            if (!isInitialized) {
                throw new Error('Failed to initialize Health Connect');
            }

            console.log("Requesting permissions for Steps...");
            const grantedPermissions = await requestPermission([
                { accessType: 'read', recordType: 'Steps' },
            ]);
            if (!grantedPermissions) {
                throw new Error('Permission denied');
            }

            let totalSteps = 0;
            for (const { startTime, endTime } of timeRanges) {
                console.log("Reading step records from", startTime, "to", endTime);
                const { records } = await readRecords('Steps', {
                    timeRangeFilter: {
                        operator: 'between',
                        startTime: new Date(startTime).toISOString(),
                        endTime: new Date(endTime).toISOString(),
                    },
                });
                totalSteps += records.reduce((sum, record) => sum + (record.count || 0), 0);
            }

            console.log("Total Steps for specified time ranges:", totalSteps);
            setSteps(totalSteps);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching step data:", err);
        } finally {
            setLoading(false);
        }
    }, [initialTimeRanges]);

    return { steps, error, loading, fetchStepsForTimeRanges };
};

export default useStepRangeData;