import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyC7iJrhkGSEh4xEB7rGkxuScRhrNYXkxDk",
  authDomain: "database-d66b6.firebaseapp.com",
  projectId: "database-d66b6",
  storageBucket: "database-d66b6.appspot.com",
  messagingSenderId: "514543692789",
  appId: "1:514543692789:web:216bbe0a9206f98d194ebc",
  measurementId: "G-DTMMCBQDX2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
