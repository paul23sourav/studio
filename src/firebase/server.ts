import * as admin from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : null;

if (!admin.apps.length) {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    // This is for local development without service account
    // It uses Application Default Credentials
    admin.initializeApp();
    console.warn("Firebase Admin SDK initialized without a service account. Using Application Default Credentials.");
  }
}

export const firestore = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();
