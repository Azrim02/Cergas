import React, { createContext, useState, useEffect, useContext } from "react";
import { db, auth } from "../api/firebase/firebaseConfig";
import { collection, getDocs, query, where, addDoc, onSnapshot, doc, setDoc } from "firebase/firestore";


// Create Context
const WorkplaceContext = createContext();

// Context Provider
export const WorkplaceProvider = ({ children }) => {
    const [workplaceData, setWorkplaceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = auth.currentUser;

    // Fetch workplace details from Firestore
    const fetchWorkplaceData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const q = query(collection(db, "workplaces"), where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const workplace = querySnapshot.docs[0].data();
                setWorkplaceData(workplace);
            } else {
                setWorkplaceData(null); // No data found
            }
        } catch (error) {
            console.error("Error fetching workplace data:", error);
        }
        setLoading(false);
    };

    // Listen for real-time updates from Firestore
    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, "workplaces"), where("userId", "==", user.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            if (!querySnapshot.empty) {
                const workplace = querySnapshot.docs[0].data();
                setWorkplaceData(workplace);
            } else {
                setWorkplaceData(null);
            }
        });
        return unsubscribe; // Cleanup listener on unmount
    }, [user]);

    // Save workplace details to Firestore
    const saveWorkplaceDetails = async (data) => {
        if (!user) return;
        try {
            const userWorkplaceRef = doc(db, "workplaces", user.uid); // Use user's UID as document ID
            await setDoc(userWorkplaceRef, {
                userId: user.uid, 
                ...data,
                createdAt: new Date().toISOString(),
            });
    
            setWorkplaceData(data); // Update local state
            console.log("✅ Workplace details saved successfully!");
        } catch (error) {
            console.error("❌ Error saving workplace details:", error);
        }
    };

    return (
        <WorkplaceContext.Provider value={{ workplaceData, loading, fetchWorkplaceData, saveWorkplaceDetails }}>
            {children}
        </WorkplaceContext.Provider>
    );
};

// Custom Hook to Use Context
export const useWorkplace = () => useContext(WorkplaceContext);