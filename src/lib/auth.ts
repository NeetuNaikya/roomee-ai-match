import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';

const firebaseConfig = {
  // These would be your actual Firebase config values
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "roomee-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "roomee-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "roomee-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account',
  hd: 'gmail.com' // Restrict to Gmail accounts only
});

export const signInWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Verify it's a Gmail account
    if (!user.email?.endsWith('@gmail.com')) {
      await signOut(auth);
      throw new Error('Only Gmail accounts are allowed');
    }
    
    // Check for suspicious domains or disposable emails
    const suspiciousDomains = ['tempmail', 'guerrillamail', '10minutemail', 'mailinator'];
    const emailDomain = user.email.split('@')[1];
    
    if (suspiciousDomains.some(domain => emailDomain.includes(domain))) {
      await signOut(auth);
      throw new Error('Disposable email addresses are not allowed');
    }
    
    return user;
  } catch (error: any) {
    console.error('Gmail authentication failed:', error);
    throw error;
  }
};

export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out failed:', error);
    throw error;
  }
};

export const isValidGmailAccount = (email: string): boolean => {
  return email.endsWith('@gmail.com') && !email.includes('+');
};