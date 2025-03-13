import { useState, useCallback } from 'react';
import { initialize, requestPermission, readRecords } from 'react-native-health-connect';

const useStepData = () => {
    const [steps, setSteps] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchStepData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("Initializing Health Connect...");
            const isInitialized = await initialize();
            if (!isInitialized) {
                setError('Failed to initialize Health Connect');
                console.error("Failed to initialize Health Connect");
                setLoading(false);
                return;
            }

            console.log("Requesting permissions for Steps...");
            const grantedPermissions = await requestPermission([
                { accessType: 'read', recordType: 'Steps' },
            ]);
            if (!grantedPermissions) {
                setError('Permission denied');
                console.error("Permission denied");
                setLoading(false);
                return;
            }

            console.log("Reading step records...");
            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
            
            const { records } = await readRecords('Steps', {
                timeRangeFilter: {
                    operator: 'between',
                    startTime: startOfDay,
                    endTime: now.toISOString(),
                },
            });
            
            const totalSteps = records.reduce((sum, record) => sum + (record.count || 0), 0);
            
            console.log("Total Steps Today:", totalSteps);
            setSteps(totalSteps);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching step data:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    return { steps, error, loading, fetchStepData };
};

export default useStepData;