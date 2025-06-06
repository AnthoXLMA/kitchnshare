// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDqa9B1xZHCP3lXorgn5Kk_0ljt0aAcLC4",
  authDomain: "kitchnshare.firebaseapp.com",
  projectId: "kitchnshare",
  storageBucket: "kitchnshare.firebasestorage.app",
  messagingSenderId: "26857690872",
  appId: "1:26857690872:web:1d3b227069eb596142cd0d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const firebaseConfig = {
  apiKey: "AIzaSyDqa9B1xZHCP3lXorgn5Kk_0ljt0aAcLC4",
  authDomain: "kitchnshare.firebaseapp.com",
  projectId: "kitchnshare",
  storageBucket: "kitchnshare.firebasestorage.app",
  messagingSenderId: "26857690872",
  appId: "1:26857690872:web:1d3b227069eb596142cd0d"
};
