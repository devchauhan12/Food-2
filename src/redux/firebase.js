// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC-cNHNQwh-xWzOpRMiVP8bXbfeV-htCag",
    authDomain: "foodordering-reactjs.firebaseapp.com",
    projectId: "foodordering-reactjs",
    storageBucket: "foodordering-reactjs.appspot.com",
    messagingSenderId: "314915934688",
    appId: "1:314915934688:web:161dd165a7ade204439b85",
    measurementId: "G-1T2X7Q95Q3"
};

// Initialize Firebase
// const analytics = getAnalytics(app);
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);