import "dotenv/config";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

/**
 * Initializes the Firebase Admin SDK.
 * Preferred: FIREBASE_SERVICE_ACCOUNT env var containing the FULL
 * service-account JSON (put it on one line; keep \n inside private_key).
 * Fallback: GOOGLE_APPLICATION_CREDENTIALS pointing to a key file.
 *
 * Firebase is OPTIONAL: when no credentials are available, `db` is null
 * and consumers fall back to local storage (see routes/contact.js).
 */
export const firestoreReady = Boolean(
  process.env.FIREBASE_SERVICE_ACCOUNT || process.env.GOOGLE_APPLICATION_CREDENTIALS
);

let db = null;

if (firestoreReady) {
  try {
    if (!getApps().length) {
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
        const serviceAccount = JSON.parse(raw);
        // Support literal "\n" sequences when the JSON is pasted into some hosts
        if (typeof serviceAccount.private_key === "string") {
          serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
        }
        initializeApp({ credential: cert(serviceAccount) });
      } else {
        initializeApp();
      }
    }
    db = getFirestore();
  } catch (err) {
    console.error("[firebaseAdmin] initialization failed, running without Firestore:", err.message);
    db = null;
  }
} else {
  console.warn("[firebaseAdmin] No Firebase credentials set — messages will be stored locally.");
}

export { db };
