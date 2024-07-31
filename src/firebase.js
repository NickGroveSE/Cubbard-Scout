import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
    authDomain: "cubbard-scout.firebaseapp.com",
    databaseURL: "https://cubbard-scout-default-rtdb.firebaseio.com",
    projectId: "cubbard-scout",
    storageBucket: "cubbard-scout.appspot.com",
    messagingSenderId: process.env.NEXT_PUBLIC_FB_MSGSNDR_ID,
    appId: process.env.NEXT_PUBLIC_FB_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)
export { firestore }