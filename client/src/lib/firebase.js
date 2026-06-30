import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

/**
 * Firebase web config — read from VITE_FIREBASE_* env vars (see client/.env,
 * which is gitignored). Keep these out of source so they aren't committed.
 * They identify the project rather than being true secrets, so protect them
 * with Firebase Security Rules + API-key restrictions in Google Cloud Console.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey) {
  console.error("Firebase config is missing — set VITE_FIREBASE_* in client/.env");
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Keep the admin signed in across reloads (until they explicitly log out).
setPersistence(auth, browserLocalPersistence).catch(() => {});
