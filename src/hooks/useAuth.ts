import { useState, useEffect } from 'react';
import { User, AuthState, SignInCredentials } from '../types/Auth';

const AUTH_STORAGE_KEY = 'eatro-auth';
const IDENTITY_CHOSEN_KEY = 'eatro-identity-chosen';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          user: parsed.user,
          isAuthenticated: !!parsed.user,
          isGuest: parsed.user?.provider === 'guest'
        };
      } catch {
        return { user: null, isAuthenticated: false, isGuest: false };
      }
    }
    return { user: null, isAuthenticated: false, isGuest: false };
  });

  // Check if user has chosen an identity (guest or account)
  const hasChosenIdentity = () => {
    return localStorage.getItem(IDENTITY_CHOSEN_KEY) === 'true' || authState.isAuthenticated;
  };
  // Save auth state to localStorage
  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
    if (authState.isAuthenticated) {
      localStorage.setItem(IDENTITY_CHOSEN_KEY, 'true');
    }
  }, [authState]);

  const signInWithGoogle = async (): Promise<void> => {
    // Mock Google sign-in
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: 'google_' + Date.now(),
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      provider: 'google',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
    };

    setAuthState({
      user,
      isAuthenticated: true,
      isGuest: false
    });
  };

  const signInWithEmail = async (credentials: SignInCredentials): Promise<void> => {
    // Mock email sign-in
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: 'email_' + Date.now(),
      name: credentials.email.split('@')[0],
      email: credentials.email,
      provider: 'email'
    };

    setAuthState({
      user,
      isAuthenticated: true,
      isGuest: false
    });
  };

  const signUpWithEmail = async (credentials: SignInCredentials & { confirmPassword: string }): Promise<void> => {
    // Mock email sign-up
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: 'email_' + Date.now(),
      name: credentials.email.split('@')[0],
      email: credentials.email,
      provider: 'email'
    };

    setAuthState({
      user,
      isAuthenticated: true,
      isGuest: false
    });
  };

  const forgotPassword = async (email: string): Promise<void> => {
    // Mock forgot password
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In a real app, this would send a reset email
    console.log('Password reset email sent to:', email);
  };
  const continueAsGuest = (): void => {
    const user: User = {
      id: 'guest_' + Date.now(),
      name: 'Guest User',
      email: '',
      provider: 'guest'
    };

    setAuthState({
      user,
      isAuthenticated: true,
      isGuest: true
    });
    
    localStorage.setItem(IDENTITY_CHOSEN_KEY, 'true');
  };

  const signOut = (): void => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isGuest: false
    });
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(IDENTITY_CHOSEN_KEY);
  };

  const deleteAccount = (): void => {
    // Clear all user data including favorites
    localStorage.removeItem('eatro-favorites');
    localStorage.removeItem('eatro-preferences');
    localStorage.removeItem(IDENTITY_CHOSEN_KEY);
    signOut();
  };

  return {
    ...authState,
    hasChosenIdentity,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    forgotPassword,
    continueAsGuest,
    signOut,
    deleteAccount
  };
};