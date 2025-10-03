"use client";
import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Lê variáveis de ambiente (podem não existir em build)
const apiKey = process.env.NEXT_PUBLIC_FB_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FB_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET;
const appId = process.env.NEXT_PUBLIC_FB_APP_ID;

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  appId,
};

const isBrowser = typeof window !== "undefined";
const hasConfig = Boolean(apiKey && authDomain && projectId && appId);

let app: FirebaseApp | null = null;
if (isBrowser && hasConfig) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig as {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket?: string;
    appId: string;
  });
}

export const auth: Auth = app ? getAuth(app) : ({} as Auth);
export const db: Firestore = app ? getFirestore(app) : ({} as Firestore);
export const googleProvider = new GoogleAuthProvider();