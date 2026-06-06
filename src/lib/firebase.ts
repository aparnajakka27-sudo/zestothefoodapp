import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getAnalytics } from "firebase/analytics"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgT1vCU68GliV_NAs8rfty-4Tg-OI43kU",
  authDomain: "zestothefoodapp.firebaseapp.com",
  projectId: "zestothefoodapp",
  storageBucket: "zestothefoodapp.firebasestorage.app",
  messagingSenderId: "93700295395",
  appId: "1:93700295395:web:6e1d3ef4de3616071593d6",
  measurementId: "G-NNCE7KY003"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Export Auth services
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null
