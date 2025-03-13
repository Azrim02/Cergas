import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

const LOCATION_TASK_NAME = "background-location-task";

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
        console.error("Background location task error:", error);
        return;
    }
    if (data) {
        const { locations } = data;
        console.log("Background location:", locations);

        // TODO: You can save this to Firestore or update context
    }
});
