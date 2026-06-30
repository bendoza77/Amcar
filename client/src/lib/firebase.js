import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

/**
 * Firebase web config. These values are public by design (they identify the
 * project, they're not secrets) so it's fine to ship them in the bundle.
 * Each can be overridden via VITE_FIREBASE_* env vars if you prefer.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBYDVVxCte5HDfhWOusMHi8cNn7jZquGAI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "amcar-17f28.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "amcar-17f28",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "amcar-17f28.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "614298095636",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:614298095636:web:c3f25c9e996883cfd91701",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Keep the admin signed in across reloads (until they explicitly log out).
setPersistence(auth, browserLocalPersistence).catch(() => {});
