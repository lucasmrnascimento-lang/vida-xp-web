import { getApps, initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Configurações do Firebase vindas do .env.local
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET!,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID!,
}

// Evita recriar app se já estiver rodando
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)

// Exporta serviços para usar no resto do app
export const auth = getAuth(app)             // login de usuários
export const db = getFirestore(app)          // banco de dados
export const googleProvider = new GoogleAuthProvider() // login Google