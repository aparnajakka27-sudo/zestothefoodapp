import { auth, googleProvider } from './firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signInWithPopup,
  signOut as firebaseSignOut
} from 'firebase/auth'
import type { User } from 'firebase/auth'

export interface AuthUser {
  uid: string
  name: string
  email: string
  username?: string
  avatarUrl?: string
}

const mapFirebaseUser = (user: User): AuthUser => {
  const email = user.email || ''
  const name = user.displayName || email.split('@')[0] || 'User'
  const username = email.split('@')[0] || ''
  const avatarUrl = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF7A30&color=fff&bold=true&size=128`

  return {
    uid: user.uid,
    name,
    email,
    username,
    avatarUrl
  }
}

const getMappedAuthError = (error: any): Error => {
  const code = error.code
  let message = error.message || 'An error occurred during authentication.'

  switch (code) {
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
      message = 'Incorrect email or password. Please try again.'
      break
    case 'auth/wrong-password':
      message = 'Incorrect password. Please try again.'
      break
    case 'auth/email-already-in-use':
      message = 'An account with this email already exists.'
      break
    case 'auth/weak-password':
      message = 'Password must be at least 6 characters.'
      break
    case 'auth/invalid-email':
      message = 'Please enter a valid email address.'
      break
    case 'auth/too-many-requests':
      message = 'Too many unsuccessful attempts. Please try again later.'
      break
    case 'auth/user-disabled':
      message = 'This account has been disabled.'
      break
    case 'auth/popup-closed-by-user':
      message = 'Sign-in window was closed. Please try again.'
      break
  }

  const mappedError = new Error(message)
  ;(mappedError as any).code = code
  return mappedError
}

export const authService = {
  /**
   * Check if a user is currently logged in on mount
   */
  getCurrentUser: (): AuthUser | null => {
    const user = auth.currentUser
    if (!user) return null
    return mapFirebaseUser(user)
  },

  /**
   * Sign In with Email and Password
   */
  signInWithEmail: async (email: string, password: string): Promise<AuthUser> => {
    if (!email || !password) {
      throw new Error('Please enter both email and password.')
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return mapFirebaseUser(userCredential.user)
    } catch (err: any) {
      throw getMappedAuthError(err)
    }
  },

  /**
   * Sign Up with Name, Email, Password, and optional Username
   */
  signUpWithEmail: async (name: string, email: string, password: string, _username?: string): Promise<AuthUser> => {
    if (!name || !email || !password) {
      throw new Error('Please fill in all required fields.')
    }
    if (password.length < 6) {
      const error = new Error('Password must be at least 6 characters.')
      ;(error as any).code = 'auth/weak-password'
      throw error
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF7A30&color=fff&bold=true&size=128`
      
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: avatarUrl
      })

      return mapFirebaseUser({
        ...userCredential.user,
        displayName: name,
        photoURL: avatarUrl
      } as any)
    } catch (err: any) {
      throw getMappedAuthError(err)
    }
  },

  /**
   * Send Password Reset Link Email
   */
  sendPasswordReset: async (email: string): Promise<void> => {
    if (!email) {
      throw new Error('Please enter your email address.')
    }
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (err: any) {
      throw getMappedAuthError(err)
    }
  },

  /**
   * Continue with Google Authentication
   */
  signInWithGoogle: async (): Promise<AuthUser> => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider)
      return mapFirebaseUser(userCredential.user)
    } catch (err: any) {
      throw getMappedAuthError(err)
    }
  },

  /**
   * Sign Out Current User Session
   */
  signOut: async (): Promise<void> => {
    try {
      await firebaseSignOut(auth)
    } catch (err: any) {
      console.error('Firebase sign out failed', err)
      throw err
    }
  }
}
