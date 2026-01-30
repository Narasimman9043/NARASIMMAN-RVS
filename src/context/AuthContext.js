import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.displayName || 'User'}&background=6366f1&color=fff`,
          createdAt: userDoc.exists() ? userDoc.data().createdAt : new Date().toISOString(),
          ...userDoc.data()
        };
        
        // Save/update user data in Firestore
        await setDoc(doc(db, 'users', firebaseUser.uid), userData, { merge: true });
        setUser(userData);
      } else {
        // User is signed out
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: getFirebaseErrorMessage(error.code)
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setIsLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      await updateProfile(result.user, {
        displayName: name
      });

      // Create user document in Firestore
      const userData = {
        id: result.user.uid,
        email: email,
        name: name,
        avatar: `https://ui-avatars.com/api/?name=${name}&background=6366f1&color=fff`,
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', result.user.uid), userData);
      
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: getFirebaseErrorMessage(error.code)
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return { 
        success: false, 
        error: getFirebaseErrorMessage(error.code)
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Helper function to get user-friendly error messages
  const getFirebaseErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed before completing.';
      case 'auth/cancelled-popup-request':
        return 'Sign-in was cancelled.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    signInWithGoogle,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};