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
            console.log("Initializing Health Connect...");
            const isInitialized = await initialize();
            if (!isInitialized) {
                setError('Failed to initialize Health Connect');
                console.error("Failed to initialize Health Connect");
                return;
            }

            console.log("Requesting permissions...");
            const grantedPermissions = await requestPermission([
                { accessType: 'read', recordType: 'Steps' },
            ]);
            if (!grantedPermissions) {
                setError('Permission denied');
                console.error("Permission denied");
                return;
            }

            console.log("Reading records...");
            const { records } = await readRecords("Steps", {
                timeRangeFilter: { operator: "after", startTime: "2025-01-01T00:00:00.000Z" }
              });
              
            
            console.log("Fetched Records:", records);
            setRecords(records);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching health data:", err);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Button title="Fetch Steps Data" onPress={fetchHealthData} />
            {error && <Text style={{ color: 'red' }}>{error}</Text>}
            <FlatList
                data={records}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={{ marginVertical: 5 }}>
                        <Text>Steps: {item.count}</Text>
                        <Text>Time: {item.startTime}</Text>
                    </View>
                )}
            />
        </View>
    );
};

export default HealthDataReader;