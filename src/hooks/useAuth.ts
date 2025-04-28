import { useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types/auth';
import { signIn as authSignIn, signUp as authSignUp, signOut as authSignOut, getSession } from '../lib/localAuth';

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkUser = async () => {
    try {
      const session = await getSession();
      setUser(session);
    } catch (error) {
      console.error('Error checking user session:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Listen for auth changes
  useEffect(() => {
    checkUser();

    const handleUserChange = () => {
      checkUser();
    };

    window.addEventListener('userChange', handleUserChange);
    return () => {
      window.removeEventListener('userChange', handleUserChange);
    };
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const userProfile = await authSignIn(email, password);
      setUser(userProfile);
      return userProfile;
    } catch (error) {
      console.error('Error signing in:', error);
      setError((error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, role: UserRole, fullName: string) => {
    try {
      setLoading(true);
      setError(null);
      const userProfile = await authSignUp(email, password, role, fullName);
      setUser(userProfile);
      return userProfile;
    } catch (error) {
      console.error('Error signing up:', error);
      setError((error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await authSignOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut
  };
}; 