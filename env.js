(function initializeEnv() {
  // Crear un objeto inmutable con getters
  Object.defineProperty(window, 'ENV', {
    value: Object.freeze({
      VITE_FIREBASE_API_KEY: '${VITE_FIREBASE_API_KEY}',
      VITE_FIREBASE_AUTH_DOMAIN: '${VITE_FIREBASE_AUTH_DOMAIN}',
      VITE_FIREBASE_PROJECT_ID: '${VITE_FIREBASE_PROJECT_ID}',
      VITE_FIREBASE_STORAGE_BUCKET: '${VITE_FIREBASE_STORAGE_BUCKET}',
      VITE_FIREBASE_MESSAGING_SENDER_ID: '${VITE_FIREBASE_MESSAGING_SENDER_ID}',
      VITE_FIREBASE_APP_ID: '${VITE_FIREBASE_APP_ID}',
      VITE_FIREBASE_MEASUREMENT_ID: '${VITE_FIREBASE_MEASUREMENT_ID}'
    }),
    writable: false,
    configurable: false
  });

  // Verificar que todas las variables estén definidas
  const missingVars = Object.entries(window.ENV).filter(([_, value]) => !value || value.includes('$'));
  if (missingVars.length > 0) {
    console.error('Missing environment variables:', missingVars.map(([key]) => key));
  } else {
    console.log('All environment variables loaded successfully');
  }
})(); 