
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import {
  getReactNativePersistence,
  initializeAuth
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-project.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:demo',
};


const isFirebaseConfigured = process.env.EXPO_PUBLIC_FIREBASE_API_KEY && 
                             process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;

let app = null;
let auth = null;
let db = null;

try {

  app = initializeApp(firebaseConfig);


  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });


  db = getFirestore(app);
} catch (error) {

}

export { auth, db, isFirebaseConfigured };
export default app; 