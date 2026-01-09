import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBx96YMtsPWvpOC397AtxwfPlBKieF0PWY",
    authDomain: "prayukti-ee020.firebaseapp.com",
    databaseURL: "https://prayukti-ee020-default-rtdb.firebaseio.com",
    projectId: "prayukti-ee020",
    storageBucket: "prayukti-ee020.firebasestorage.app",
    messagingSenderId: "528676076234",
    appId: "1:528676076234:web:b0397322d49c97676cd233",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);