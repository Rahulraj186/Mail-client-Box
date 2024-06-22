// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBH-2ZZlMm1tJspEyXjAN8S5hwV5VyWPzQ",
  authDomain: "mail-client-box-react.firebaseapp.com",
  projectId: "mail-client-box-react",
  storageBucket: "mail-client-box-react.appspot.com",
  messagingSenderId: "794485788300",
  appId: "1:794485788300:web:037174fc2c9982369b35a9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
