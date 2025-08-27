import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase?.auth?.getSession();
        if (error) throw error;
        
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserProfile(session?.user?.id);
        }
      } catch (error) {
        if (error?.message?.includes('Failed to fetch')) {
          setAuthError('Cannot connect to authentication service. Your Supabase project may be paused or inactive.');
        } else {
          setAuthError('Failed to load user session');
          console.error('Session error:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (session?.user) {
          fetchUserProfile(session?.user?.id);
        } else {
          setUserProfile(null);
        }
        
        if (event === 'SIGNED_OUT') {
          setUserProfile(null);
          setAuthError(null);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single();

      if (error) {
        if (error?.code === 'PGRST116') {
          // Profile doesn't exist, this is normal for new users
          setUserProfile(null);
        } else {
          setAuthError(`Failed to load user profile: ${error?.message}`);
        }
        return;
      }

      setUserProfile(data);
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        setAuthError('Cannot connect to database. Please check your internet connection.');
      } else {
        setAuthError('Failed to load user profile');
        console.error('Profile fetch error:', error);
      }
    }
  };

  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true);
      setAuthError(null);

      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData?.full_name || '',
            role: userData?.role || 'student'
          }
        }
      });

      if (error) {
        setAuthError(error?.message);
        return { user: null, error };
      }

      return { user: data?.user, error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        setAuthError('Cannot connect to authentication service. Your Supabase project may be paused or inactive.');
      } else {
        setAuthError('Sign up failed. Please try again.');
        console.error('Sign up error:', error);
      }
      return { user: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setAuthError(null);

      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      });

      if (error) {
        setAuthError(error?.message);
        return { user: null, error };
      }

      return { user: data?.user, error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        setAuthError('Cannot connect to authentication service. Your Supabase project may be paused or inactive.');
      } else {
        setAuthError('Sign in failed. Please try again.');
        console.error('Sign in error:', error);
      }
      return { user: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      
      const { error } = await supabase?.auth?.signOut();
      if (error) {
        setAuthError(error?.message);
        return { error };
      }

      setUser(null);
      setUserProfile(null);
      return { error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        setAuthError('Cannot connect to authentication service');
      } else {
        setAuthError('Sign out failed');
        console.error('Sign out error:', error);
      }
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      setAuthError(null);
      
      if (!user?.id) {
        throw new Error('No authenticated user');
      }

      const { data, error } = await supabase?.from('user_profiles')?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })?.eq('id', user?.id)?.select()?.single();

      if (error) {
        setAuthError(`Failed to update profile: ${error?.message}`);
        return { data: null, error };
      }

      setUserProfile(data);
      return { data, error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        setAuthError('Cannot connect to database');
      } else {
        setAuthError('Profile update failed');
        console.error('Profile update error:', error);
      }
      return { data: null, error };
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    authError,
    signUp,
    signIn,
    signOut,
    updateProfile,
    clearError: () => setAuthError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;