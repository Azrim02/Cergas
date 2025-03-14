import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { db } from "../api/firebase/firebaseConfig";
import { useAuth } from "../api/firebase/AuthProvider";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Card from "../components/Card";
import colors from "../config/colors";

const DailyHealthScreen = () => {
    const { user } = useAuth();
    const [healthData, setHealthData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchDailyHealthData(user.uid);
        }
    }, [user]);

    const fetchDailyHealthData = async (uid) => {
        setLoading(true);
        try {
            const healthCollection = collection(db, "users", uid, "dailyHealth");
            const q = query(healthCollection, orderBy("date", "desc")); // Order by most recent first
            const querySnapshot = await getDocs(q);
            
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setHealthData(data);
        } catch (error) {
            console.error("❌ Error fetching health data:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <Card
            title={`Date: ${item.date}`}
            subTitle={`Steps: ${item.steps} | RHR: ${item.restingHeartRate} BPM`}
            lastUpdated={`Check-in: ${new Date(item.checkIn).toLocaleTimeString()} | Check-out: ${item.checkOut ? new Date(item.checkOut).toLocaleTimeString() : "-"}`}
            chevron={false}
        />
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Daily Health Records</Text>
            {loading ? <ActivityIndicator size="large" color={colors.primary} /> : 
                <FlatList
                    data={healthData}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                />
            }
        </View>
    );
};

export default DailyHealthScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightgrey,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: colors.primary,
    },
});