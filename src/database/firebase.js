// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCoQg1NIDYV5aIONoOkBx0sLjmfjKAZFFY",
  authDomain: "unsw-balloon-xp.firebaseapp.com",
  databaseURL: "https://unsw-balloon-xp-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "unsw-balloon-xp",
  storageBucket: "unsw-balloon-xp.appspot.com",
  messagingSenderId: "602667527407",
  appId: "1:602667527407:web:6e457c168c8ff6ed017f1a",
  measurementId: "G-HLCYEG37GP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
getAnalytics(app);
// Initialize Realtime Database and get a reference to the service
const db = getFirestore(app);

export default db;
