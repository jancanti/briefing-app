import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAPqlm9JypQoMQ4UQ0SlawKAkXptahWgTc',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'briefing-app-d0151.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'briefing-app-d0151',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'briefing-app-d0151.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '817865662011',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:817865662011:web:605f062146db8afd8d861e',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

const app = isFirebaseConfigured
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp())
  : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
