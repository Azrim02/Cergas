import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchActivities = async () => {
    const accessToken = await AsyncStorage.getItem("access_token");
    if (!accessToken) return [];

    const response = await fetch("https://www.strava.com/api/v3/athlete/activities", {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    return response.json();
};

export const getStepCount = async () => {
    const activities = await fetchActivities();

    return activities
        .filter((activity) => activity.type === "Run" || activity.type === "Walk")
        .map((activity) => ({
        id: activity.id,
        date: activity.start_date,
        distance: activity.distance, // meters
        estimated_steps: Math.round(activity.distance / 0.8), // Approx. step length = 0.8m
        }));
};
