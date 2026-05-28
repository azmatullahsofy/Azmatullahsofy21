import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Detect if we are using the fallback mock values or if they are genuine
export const isFirebaseAvailable = 
  firebaseConfig && 
  firebaseConfig.apiKey !== '' && 
  firebaseConfig.apiKey !== 'mock-api-key' &&
  !firebaseConfig.apiKey.includes('MY_GEMINI_API');

let app;
let database: any = null;
let authentication: any = null;

if (isFirebaseAvailable) {
  try {
    const apps = getApps();
    if (apps.length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = apps[0];
    }
    database = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    authentication = getAuth(app);
    console.log("Firebase initialized successfully with credentials.");

    // Validate Connection to Firestore on boot
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(database, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();
  } catch (error) {
    console.warn("Failed to initialize active Firebase. Falling back to local replication.", error);
  }
} else {
  console.log("Using localized replication for Digital Masjid System (Firebase setup pending).");
}

export const db = database;
export const auth = authentication;
