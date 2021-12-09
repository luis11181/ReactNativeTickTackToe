// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBx6fpiwLMTMHrBpJkZZNHAn9fzOu3LcIU",
  authDomain: "trick-675e7.firebaseapp.com",
  projectId: "trick-675e7",
  storageBucket: "trick-675e7.appspot.com",
  messagingSenderId: "415727832601",
  appId: "1:415727832601:web:059aefcb94262a96eee488",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore();
