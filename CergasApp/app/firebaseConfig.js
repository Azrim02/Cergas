import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your Firebase Config (from Firebase Console)

const firebaseConfig = {
    apiKey: "AIzaSyDbj58lqSvjFEz4ODlThXyJqUR_kyxohQo",
    authDomain: "cergas-abf9a.firebaseapp.com",
    projectId: "cergas-abf9a",
    storageBucket: "cergas-abf9a.firebasestorage.app",
    messagingSenderId: "804422169817",
    appId: "1:804422169817:web:f59c3c5a68cdcc19227ac8",
    measurementId: "G-0CK24SR4SP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };
