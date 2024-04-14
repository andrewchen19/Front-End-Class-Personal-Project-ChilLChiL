import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-FD8i2uceYO-0DjdWL59LhPNg3axBaBI",
  authDomain: "chillchill-9a1e2.firebaseapp.com",
  projectId: "chillchill-9a1e2",
  storageBucket: "chillchill-9a1e2.appspot.com",
  messagingSenderId: "1080449490744",
  appId: "1:1080449490744:web:c82ea01563374b48b26bcd",
  measurementId: "G-S766D2JP45",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

let container: HTMLElement | null = null;

document.addEventListener("DOMContentLoaded", function () {
  if (!container) {
    container = document.getElementById("root") as HTMLElement;
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
});
