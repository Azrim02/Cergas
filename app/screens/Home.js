import React, { useEffect, useState } from "react";
import { 
    View, Text, StyleSheet, FlatList, Modal, TouchableOpacity, RefreshControl, ScrollView, KeyboardAvoidingView, Platform 
} from "react-native";
import { useAuth } from "../api/firebase/AuthProvider";
import { useIsWorking } from "../context/IsWorkingProvider";
import { useHealth } from "../context/HealthProvider"; // Import HealthProvider
import { useWorkplace } from "../context/WorkplaceProvider";

import Card from "../components/Card";
import colors from "../config/colors";

function Home() {
    const { user } = useAuth();
    const { workplaceData } = useWorkplace();
    const { workHourSteps, restingHeartRate, stepEntries, heartRateEntries, fetchStepsForCheckInOut, fetchHeartRateForCheckInOut, loading, error } = useHealth();
    const { isAtWork, isWithinWorkHours, distanceToWorkplace, checkInTime, checkOutTime } = useIsWorking();
    const isWorking = isAtWork && isWithinWorkHours;

    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState("steps"); // "steps" or "heartRate"
    const [refreshKey, setRefreshKey] = useState(0); // Refresh trigger

    const [trackingData, setTrackingData] = useState([
        {
            id: 1,
            data: "Workplace Steps",
            value: "Fetching...",
            lastUpdated: null,
            icon: "foot-print",
        },
        {
            id: 2,
            data: "Resting Heart Rate",
            value: "Fetching...",
            lastUpdated: null,
            icon: "heart",
        },
    ]);

    // 🔄 Update tracking data when steps or heart rate changes
    useEffect(() => {
        console.log("🔄 workHourSteps changed:", workHourSteps);
        console.log("🔄 restingHeartRate changed:", restingHeartRate);

        if (!loading && !error) {
            setTrackingData([
                {
                    id: 1,
                    data: "Workplace Steps",
                    value: workHourSteps !== null ? `${workHourSteps} steps` : "No Data",
                    lastUpdated: new Date().toLocaleTimeString(),
                    icon: "foot-print",
                },
                {
                    id: 2,
                    data: "Resting Heart Rate",
                    value: restingHeartRate !== null ? `${restingHeartRate} BPM` : "No Data",
                    lastUpdated: new Date().toLocaleTimeString(),
                    icon: "heart",
                },
            ]);
        }
    }, [workHourSteps, restingHeartRate, loading, error, refreshKey]);

    // 🔄 Refresh steps & heart rate data
    const onRefresh = async () => {
        setRefreshing(true);
        console.log("🔄 Refreshing step & heart rate data...");

        try {
            if (checkInTime) {
                const startTime = checkInTime;
                const endTime = checkOutTime || new Date(); // If no check-out, use current time
                console.log(`📊 Fetching steps & heart rate from ${startTime.toLocaleTimeString()} to ${endTime.toLocaleTimeString()}`);

                await Promise.all([
                    fetchStepsForCheckInOut(startTime, endTime),
                    fetchHeartRateForCheckInOut(startTime, endTime)
                ]);
            } else {
                console.log("⚠️ No check-in recorded yet. Steps & heart rate cannot be fetched.");
            }
        } catch (error) {
            console.error("❌ Error fetching data:", error);
        }

        setRefreshKey((prevKey) => prevKey + 1); // Force re-render
        setRefreshing(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.upperContainer}>
                <Text style={styles.greetText}> Hello there, {user?.name} </Text>
                <Text style={styles.isAtWorkText}>
                    {isAtWork
                        ? `You are on site, ${isWorking ? "and you are working!" : "but you are not in your working hours."}`
                        : "You're not at work..."}
                </Text>
                {/* ⏰ Display Check-in and Check-out times */}
                <Text style={styles.checkInOutText}>
                    Clocked in: {checkInTime ? checkInTime.toLocaleTimeString() : "Not Clocked In"}
                </Text>
                <Text style={styles.checkInOutText}>
                    Clocked-out: {checkOutTime ? checkOutTime.toLocaleTimeString() : "Not Clocked Out"}
                </Text>
            </View>

            <View style={styles.lowerContainer}>
                <FlatList
                    style={styles.listContainer}
                    data={trackingData}
                    keyExtractor={(item) => item.id.toString()}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
                    }
                    renderItem={({ item }) => (
                        <Card
                            title={item.data}
                            subTitle={item.value}
                            icon={item.icon}
                            lastUpdated={"" + item.lastUpdated}
                            onPress={() => {
                                setModalType(item.id === 1 ? "steps" : "heartRate");
                                setModalVisible(true);
                            }}
                        />
                    )}
                />
            </View>

            {/* Styled Scrollable Modal to Display Step or Heart Rate Entries */}
            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{modalType === "steps" ? "Step Entries" : "Heart Rate Entries"}</Text>
                        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        <FlatList
                            data={modalType === "steps" ? stepEntries : heartRateEntries}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.entry}>
                                    <Text style={styles.entryTime}>
                                        {modalType === "steps" 
                                            ? new Date(item.startTime || item.timestamp).toLocaleTimeString() // Fixing Invalid Date
                                            : new Date(item.time).toLocaleTimeString()} {/* For BPM entries */}
                                    </Text>
                                    <Text style={styles.entryValue}>
                                        {modalType === "steps" 
                                            ? `${item.count || 0} steps` 
                                            : `${item.bpm || 0} BPM`} {/* Ensure values exist */}
                                    </Text>
                                </View>
                            )}
                        />
                        </ScrollView>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            <Text>Distance to workplace: {distanceToWorkplace ? distanceToWorkplace.toFixed(2) + "m" : "N/A"}</Text>
        </View>
    );
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightgrey,
    },
    upperContainer: {
        flex: 1,
        backgroundColor: colors.primary,
        flexDirection: "column",
        justifyContent: "flex-end",
        padding:10,
    },
    listContainer: {
        padding: 20,
    },
    greetText: {
        color: colors.white,
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "left",
        marginTop: 50,
        padding: 20,
        paddingBottom: 20,
    },
    isAtWorkText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "left",
        paddingHorizontal: 20,
        paddingBottom: 5,
    },
    checkInOutText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "left",
        paddingHorizontal: 20,
        paddingBottom: 2,
    },
    lowerContainer: {
        flex: 3,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", 
    },
    modalContent: {
        width: "90%",
        maxHeight: "80%",
        backgroundColor: colors.white,
        padding: 20,
        borderRadius: 12,
        alignItems: "center",
        elevation: 5,
    },
    entry: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightgrey,
    },
    entryTime: {
        fontSize: 16,
        color: colors.black,
    },
    entryValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.primary,
    },
});
