import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { StrictMode } from 'react'
import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// @ts-ignore
const firebaseConfig = __FIREBASE_CONFIG__;

console.log('Firebase Config Check:', {
  projectId: firebaseConfig.projectId,
  configPresent: !!firebaseConfig
});

try {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  console.log('Firebase Initialization:', {
    success: true,
    projectId: app.options.projectId
  });
  
  enableIndexedDbPersistence(db).catch((err) => {
    console.error('Persistence error:', err.code);
  });

} catch (error) {
  console.error('Firebase Initialization Error:', error);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
