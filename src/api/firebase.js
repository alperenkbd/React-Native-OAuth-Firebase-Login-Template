// Firebase configuration and initialization
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import {
    getReactNativePersistence,
    initializeAuth
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase config - these should come from environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-project.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:demo',
};

// Check if Firebase is properly configured
const isFirebaseConfigured = process.env.EXPO_PUBLIC_FIREBASE_API_KEY && 
                             process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;

let app = null;
let auth = null;
let db = null;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);

  // Initialize Auth with persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });

  // Initialize Firestore
  db = getFirestore(app);
} catch (error) {
  console.warn('Firebase initialization failed. Please check your configuration.', error);
}

export { auth, db, isFirebaseConfigured };
export default app; 