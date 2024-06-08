// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-blog-project-19ad2.firebaseapp.com",
    projectId: "mern-blog-project-19ad2",
    storageBucket: "mern-blog-project-19ad2.appspot.com",
    messagingSenderId: "715891152001",
    appId: "1:715891152001:web:394d0b9bb964407e31a980"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

