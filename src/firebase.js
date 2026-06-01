import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCpN2oTn99iqPpsG0O5_2fusrFlLOKpm8A",
    authDomain: "events-b4698.firebaseapp.com",
    projectId: "events-b4698",
    messagingSenderId: "377654745990",
    appId: "1:377654745990:web:309a8775ee96081fa0aa07",
    storageBucket: "events-b4698.appspot.com",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
