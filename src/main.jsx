import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { StrictMode } from 'react'
import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

async function initializeFirebase() {
  try {
    // Esperar a que window.ENV esté disponible de forma segura
    const maxAttempts = 50; // 5 segundos máximo
    let attempts = 0;
    
    while (!window.ENV && attempts < maxAttempts) {
      console.log('Waiting for environment variables...');
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    if (!window.ENV) {
      throw new Error('Environment variables not loaded after timeout');
    }

    // Validar que todas las variables requeridas estén presentes
    const requiredVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID'
    ];

    const missingVars = requiredVars.filter(varName => !window.ENV[varName]);
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    console.log('Environment Variables:', {
      apiKey: window.ENV.VITE_FIREBASE_API_KEY ? 'Present' : 'Missing',
      authDomain: window.ENV.VITE_FIREBASE_AUTH_DOMAIN ? 'Present' : 'Missing',
      projectId: window.ENV.VITE_FIREBASE_PROJECT_ID ? 'Present' : 'Missing',
      storageBucket: window.ENV.VITE_FIREBASE_STORAGE_BUCKET ? 'Present' : 'Missing',
      messagingSenderId: window.ENV.VITE_FIREBASE_MESSAGING_SENDER_ID ? 'Present' : 'Missing',
      appId: window.ENV.VITE_FIREBASE_APP_ID ? 'Present' : 'Missing',
      measurementId: window.ENV.VITE_FIREBASE_MEASUREMENT_ID ? 'Present' : 'Missing'
    });

    const firebaseConfig = {
      apiKey: window.ENV.VITE_FIREBASE_API_KEY,
      authDomain: window.ENV.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: window.ENV.VITE_FIREBASE_PROJECT_ID,
      storageBucket: window.ENV.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: window.ENV.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: window.ENV.VITE_FIREBASE_APP_ID,
      measurementId: window.ENV.VITE_FIREBASE_MEASUREMENT_ID
    };

    // Log the actual config
    console.log('Firebase Config:', JSON.stringify(firebaseConfig, null, 2));

    // Validate configuration
    if (!firebaseConfig.projectId) {
      console.error('Firebase Config is invalid:', firebaseConfig);
      throw new Error('Firebase Project ID is missing. Check your environment variables.');
    }

    const app = initializeApp(firebaseConfig);
    
    // Initialize Firestore with persistence
    const db = initializeFirestore(app, {
      cache: {
        localCache: {
          persistent: true
        }
      }
    });

    console.log('Firebase Initialization Success:', {
      projectId: app.options.projectId,
      config: firebaseConfig,
      db: db ? 'Initialized' : 'Failed'
    });

    window.db = db;
    return db;

  } catch (error) {
    console.error('Security Error:', error);
    // Manejar el error de forma segura
    throw new Error('Application initialization failed due to security constraints');
  }
}

// Initialize Firebase and then render the app
initializeFirebase().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}).catch(error => {
  console.error('Failed to initialize application:', error);
});
