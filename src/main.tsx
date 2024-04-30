import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// react-toastify
import "react-toastify/dist/ReactToastify.css";

// Redux Toolkit
import { store } from "./store";
import { Provider } from "react-redux";

// firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "chillchill-9a1e2.firebaseapp.com",
  projectId: "chillchill-9a1e2",
  storageBucket: "chillchill-9a1e2.appspot.com",
  messagingSenderId: "1080449490744",
  appId: "1:1080449490744:web:c82ea01563374b48b26bcd",
  measurementId: "G-S766D2JP45",
  databaseURL:
    "https://chillchill-9a1e2-default-rtdb.asia-southeast1.firebasedatabase.app/",
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

let container: HTMLElement | null = null;

document.addEventListener("DOMContentLoaded", function () {
  if (!container) {
    container = document.getElementById("root") as HTMLElement;
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>,
    );
  }
});
