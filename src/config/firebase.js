// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9siKkWMIBYRaQMPMRSP7Zx30B4uro32g",
  authDomain: "mood-tracker-dbec5.firebaseapp.com",
  projectId: "mood-tracker-dbec5",
  storageBucket: "mood-tracker-dbec5.firebasestorage.app",
  messagingSenderId: "362067703704",
  appId: "1:362067703704:web:e7e67b99c88bea4248dded",
  measurementId: "G-G3EFNP95RX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;