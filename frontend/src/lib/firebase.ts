import { getApp, getApps, initializeApp } from "firebase/app"
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type Auth,
  type User,
} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const requiredFirebaseKeys = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.appId,
]

export const firebaseConfigured = requiredFirebaseKeys.every(
  (value) => typeof value === "string" && value.length > 0,
)

const firebaseApp = firebaseConfigured
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null

export const auth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null

function actionCodeSettings(path: "/account" | "/login") {
  return { url: new URL(path, window.location.origin).toString() }
}

async function requireAuth() {
  if (!auth) {
    throw new Error("Firebase Authentication is not configured. Check the VITE_FIREBASE values in your local environment file.")
  }

  await setPersistence(auth, browserLocalPersistence)
  return auth
}

export async function createAccount(email: string, password: string, displayName: string) {
  const firebaseAuth = await requireAuth()
  const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password)
  await updateProfile(credential.user, { displayName })

  let verificationSent = true
  try {
    await sendEmailVerification(credential.user, actionCodeSettings("/account"))
  } catch {
    verificationSent = false
  }

  return { user: credential.user, verificationSent }
}

export async function signInAccount(email: string, password: string) {
  const firebaseAuth = await requireAuth()
  const credential = await signInWithEmailAndPassword(firebaseAuth, email, password)
  return credential.user
}

export async function sendPasswordReset(email: string) {
  const firebaseAuth = await requireAuth()
  await sendPasswordResetEmail(firebaseAuth, email, actionCodeSettings("/login"))
}

export async function resendVerification(user: User) {
  await sendEmailVerification(user, actionCodeSettings("/account"))
}

export async function signOutAccount() {
  const firebaseAuth = await requireAuth()
  await signOut(firebaseAuth)
}

export function getAuthErrorMessage(error: unknown) {
  const code = typeof error === "object" && error !== null && "code" in error
    ? String(error.code)
    : ""

  const messages: Record<string, string> = {
    "auth/email-already-in-use": "An account already exists for this email. Try signing in instead.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/invalid-credential": "The email or password is incorrect.",
    "auth/invalid-login-credentials": "The email or password is incorrect.",
    "auth/user-not-found": "No account was found for this email.",
    "auth/wrong-password": "The email or password is incorrect.",
    "auth/weak-password": "Choose a stronger password with at least 6 characters.",
    "auth/password-does-not-meet-requirements": "Choose a password that meets the Firebase project's password policy.",
    "auth/too-many-requests": "Too many attempts. Wait a moment and try again.",
    "auth/network-request-failed": "Could not reach Firebase. Check your connection and try again.",
    "auth/user-disabled": "This account is disabled. Contact the project administrator.",
    "auth/operation-not-allowed": "Email and password sign-in is disabled for this Firebase project.",
    "auth/unauthorized-domain": "This website's domain is not enabled in Firebase Authentication's authorized domains.",
    "auth/unauthorized-continue-uri": "Add this website's domain to Firebase Authentication's authorized domains.",
  }

  if (messages[code]) return messages[code]
  if (error instanceof Error) return error.message
  return "Something went wrong. Please try again."
}
