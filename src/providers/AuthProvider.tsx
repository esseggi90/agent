import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: { firstName: string; lastName: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'No user');
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in...');
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign in successful:', result.user.email);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error signing in:', error.code, error.message);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: { firstName: string; lastName: string }) => {
    try {
      console.log('Attempting sign up...');
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Sign up successful:', result.user.email);

      // Create user document in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        id: result.user.uid, // Explicitly store the user ID
        email: result.user.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error signing up:', error.code, error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Attempting logout...');
      await signOut(auth);
      console.log('Logout successful');
      navigate('/auth');
    } catch (error: any) {
      console.error('Error signing out:', error.code, error.message);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}