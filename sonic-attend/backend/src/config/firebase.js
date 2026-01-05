const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

let auth;

// Safe initialization
try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        // Fix for specific "Invalid PEM" error due to env var escaping
        if (serviceAccount.private_key) {
            serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('Firebase Admin initialized with Service Account');
        auth = admin.auth();
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        admin.initializeApp();
        console.log('Firebase Admin initialized with Default Credentials');
        auth = admin.auth();
    } else {
        // Intentionally do not init if no creds, to force mock mode without erroring
        throw new Error('No credentials provided');
    }
} catch (error) {
    console.warn('Firebase Admin initialization skipped/failed:', error.message);
    console.warn('Running in OFFLINE/MOCK mode for Auth.');
    auth = null;
}

module.exports = { admin, auth };
