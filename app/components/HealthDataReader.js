import React, { useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import {
  initialize,
  requestPermission,
  readRecords,
} from 'react-native-health-connect';

const HealthDataReader = () => {
    const [records, setRecords] = useState([]);
    const [error, setError] = useState(null);

    const fetchHealthData = async () => {
        try {
        // Initialize Health Connect
        const isInitialized = await initialize();
        if (!isInitialized) {
            setError('Failed to initialize Health Connect');
            return;
        }

        // Request permissions
        const grantedPermissions = await requestPermission([
            { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
        ]);
        if (!grantedPermissions) {
            setError('Permission denied');
            return;
        }

        // Read records
        const { records } = await readRecords('ActiveCaloriesBurned', {
            timeRangeFilter: {
            operator: 'between',
            startTime: '2023-01-09T12:00:00.405Z',
            endTime: '2023-01-09T23:53:15.405Z',
            },
        });
        
        setRecords(records);
        } catch (err) {
        setError(err.message);
        }
    };

    return (
        <View style={{ padding: 20 }}>
        <Button title="Fetch Health Data" onPress={fetchHealthData} />
        {error && <Text style={{ color: 'red' }}>{error}</Text>}
        <FlatList
            data={records}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
            <View style={{ marginVertical: 5 }}>
                <Text>Calories Burned: {item.energy}</Text>
                <Text>Time: {item.startTime}</Text>
            </View>
            )}
        />
        </View>
    );
};

export default HealthDataReader;
