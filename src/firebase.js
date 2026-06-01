import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY?.trim(),
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN?.trim(),
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID?.trim(),
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET?.trim(),
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID?.trim(),
    appId: process.env.REACT_APP_FIREBASE_APP_ID?.trim(),
};

console.log("FIREBASE API KEY IS:", process.env.REACT_APP_FIREBASE_API_KEY?.trim());

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
