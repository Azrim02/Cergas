import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Modal, TouchableOpacity } from "react-native";
import { useAuth } from "../api/firebase/AuthProvider";
import { useIsWorking } from "../context/IsWorkingProvider";
import { useSteps } from "../context/StepsProvider";

import Card from "../components/Card";
import colors from "../config/colors";
import { ImageBackground } from "react-native";

function Home() {
    const { user } = useAuth();
    const { workHourSteps, stepEntries, loading, error } = useSteps();
    const { isAtWork, isWithinWorkHours, distanceToWorkplace } = useIsWorking();
    const isWorking = isAtWork && isWithinWorkHours;

    const [modalVisible, setModalVisible] = useState(false);

    const [trackingData, setTrackingData] = useState([
        {
            id: 1,
            data: "Steps",
            value: "Fetching...",
            lastUpdated: null,
            icon: "foot-print",
        },
    ]);

    useEffect(() => {
        if (!loading && !error) {
            setTrackingData([
                {
                    id: 1,
                    data: "Steps",
                    value: workHourSteps || 0,
                    lastUpdated: new Date().toLocaleTimeString(),
                    icon: "foot-print",
                },
            ]);
        }
    }, [workHourSteps, loading, error]);

    return (
        <View style={styles.container}>
            <ImageBackground source={require("../assets/heartbeat_monitor.webp")} style={styles.upperContainer}>
                <Text style={styles.greetText}> Hello there, {user?.name} </Text>
                <Text style={styles.isAtWorkText}>
                    {isAtWork
                        ? `You are on site, ${isWorking ? "and you are working!" : "but you are not in your working hours."}`
                        : "You're not at work..."}
                </Text>
            </ImageBackground>

            <View style={styles.lowerContainer}>
                <FlatList
                    style={styles.listContainer}
                    data={trackingData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <Card
                            title={item.data}
                            subTitle={item.value}
                            icon={item.icon}
                            lastUpdated={"" + item.lastUpdated}
                            onPress={() => setModalVisible(true)}
                        />
                    )}
                />
            </View>

            {/* Styled Modal to Display Step Entries */}
            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Step Entries</Text>
                        <FlatList
                            data={stepEntries}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.stepEntry}>
                                    <Text style={styles.stepTime}>{new Date(item.startTime).toLocaleTimeString()}</Text>
                                    <Text style={styles.stepCount}>{item.count} steps</Text>
                                </View>
                            )}
                        />
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
        backgroundColor: colors.lightgrey,
        flexDirection: "column",
        justifyContent: "flex-end",
    },
    listContainer: {
        padding: 40,
    },
    greetText: {
        color: colors.white,
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "left",
        marginTop: 50,
        padding: 20,
        paddingBottom: 30,
    },
    isAtWorkText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "left",
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    lowerContainer: {
        flex: 3,
    },

    // --- Modal Styles ---
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay background
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "85%",
        backgroundColor: colors.white,
        padding: 20,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
    },
    stepEntry: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightgrey,
    },
    stepTime: {
        fontSize: 16,
        color: colors.black,
    },
    stepCount: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.primary,
    },
    closeButton: {
        marginTop: 15,
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    closeButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: "bold",
    },
});
