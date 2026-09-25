import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Build Firebase config using environment variable for API Key
const config = {
  ...firebaseConfig,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey
};

// Initialize Firebase
const app = initializeApp(config);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore with custom database ID
export const db = getFirestore(app, config.firestoreDatabaseId);

// Test connection on boot as required by Firebase skill
async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Please check your Firebase configuration or network connection.");
    }
  }
}
testFirestoreConnection();

// Auth Helpers
export async function signInWithGoogle(): Promise<FirebaseUser> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Sync user profile to Firestore
  try {
    const userRef = doc(db, 'users', user.uid);
    const existing = await getDoc(userRef);
    if (!existing.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Community Member',
        photoURL: user.photoURL || '',
        role: user.email?.includes('admin') || user.email?.includes('coordinator') ? 'coordinator' : 'patient',
        createdAt: new Date().toISOString()
      });
    }
  } catch (err) {
    console.warn('Error saving user profile to Firestore:', err);
  }

  return user;
}

export async function signOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

export { onAuthStateChanged };
export type { FirebaseUser };
