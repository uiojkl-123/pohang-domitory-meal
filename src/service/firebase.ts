// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDkY6GtQpPm0BFY5AotrkDseu6tp-IBpUI",
    authDomain: "pohang-domitory-meal.firebaseapp.com",
    projectId: "pohang-domitory-meal",
    storageBucket: "pohang-domitory-meal.appspot.com",
    messagingSenderId: "707125005849",
    appId: "1:707125005849:web:7d8383174f7b23fd4ee488",
    measurementId: "G-KJ0V1GFPZE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
