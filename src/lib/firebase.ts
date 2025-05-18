
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIt-yRPBd66DmTN3qLIY4QeruJvZrPClA",
  authDomain: "robosoccer-referral.firebaseapp.com",
  projectId: "robosoccer-referral",
  storageBucket: "robosoccer-referral.appspot.com",
  messagingSenderId: "204936309517",
  appId: "1:204936309517:web:d34a3b3d0a5b6b4e4a2e2e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { auth, firestore, storage, googleProvider };
