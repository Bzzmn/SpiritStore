import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { StrictMode } from 'react'
import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

// Debug: Log all environment variables (remove in production)
console.log('Environment Variables:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'Present' : 'Missing',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? 'Present' : 'Missing',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'Present' : 'Missing',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? 'Present' : 'Missing',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? 'Present' : 'Missing',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ? 'Present' : 'Missing',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ? 'Present' : 'Missing'
});

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate configuration
if (!firebaseConfig.projectId) {
  console.error('Firebase Config:', firebaseConfig);
  throw new Error('Firebase Project ID is missing. Check your environment variables.');
}

try {
  const app = initializeApp(firebaseConfig);
  
  // Initialize Firestore with persistence
  const db = initializeFirestore(app, {
    cache: {
      // Enable local persistence
      localCache: {
        // Use persistent cache
        persistent: true
      }
    }
  });

  console.log('Firebase Initialization Success:', {
    projectId: app.options.projectId,
    config: firebaseConfig
  });

  // Make db available globally for debugging
  window.db = db;

} catch (error) {
  console.error('Firebase Initialization Error:', {
    message: error.message,
    code: error.code,
    stack: error.stack
  });
  throw error;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
