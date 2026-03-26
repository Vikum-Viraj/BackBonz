// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBx5az_U884AksRPe3iDCHLCoXpf9k572Y",
  authDomain: "backbonz-39b15.firebaseapp.com",
  projectId: "backbonz-39b15",
  storageBucket: "backbonz-39b15.firebasestorage.app",
  messagingSenderId: "1056890349820",
  appId: "1:1056890349820:web:6876e52832efb7922e4f79",
  measurementId: "G-21BWW7RGRK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export auth for use in components
export const auth = getAuth(app);