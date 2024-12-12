import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCIVH8RLdRqhHgcDAvHot7qg8YwqTQwfzw",
  authDomain: "cumulus-6c72c.firebaseapp.com",
  projectId: "cumulus-6c72c",
  storageBucket: "cumulus-6c72c.firebasestorage.app",
  messagingSenderId: "938429058016",
  appId: "1:938429058016:web:397963dee13e78301cb985",
  measurementId: "G-17N92RMRSW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);