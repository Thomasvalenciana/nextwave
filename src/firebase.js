import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCidJhQ5JORXwpFCIZEgzhthq9uUeo2cX4",
    authDomain: "social-foodies-f72f1.firebaseapp.com",
    projectId: "social-foodies-f72f1",
    storageBucket: "social-foodies-f72f1.appspot.com",
    messagingSenderId: "48751409708",
    appId: "1:48751409708:web:b71753ab0db62f2487ef89",
    measurementId: "G-GVQ6PYSL75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, firestore, auth, googleProvider };
export const db = firestore;