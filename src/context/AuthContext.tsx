import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';
import { api } from '../services/api';
import { auth, signInWithGoogle as firebaseGoogleSignIn, signOutUser, onAuthStateChanged } from '../firebase';

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('careconnect_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setUser({
          id: fbUser.uid,
          email: fbUser.email || '',
          name: fbUser.displayName || 'Google User',
          role: (fbUser.email?.includes('admin') || fbUser.email?.includes('coordinator')) ? 'coordinator' : 'patient',
          photoURL: fbUser.photoURL || undefined,
          authProvider: 'google'
        });
        setIsLoading(false);
      } else {
        // Fallback to local admin token check if no firebase user is logged in
        const storedToken = localStorage.getItem('careconnect_token');
        if (storedToken) {
          api.getMe()
            .then((userProfile) => {
              setUser({ ...userProfile, authProvider: 'local' });
              setToken(storedToken);
            })
            .catch(() => {
              localStorage.removeItem('careconnect_token');
              setToken(null);
              setUser(null);
            })
            .finally(() => setIsLoading(false));
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    localStorage.setItem('careconnect_token', res.token);
    setToken(res.token);
    setUser({ ...res.user, authProvider: 'local' });
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const fbUser = await firebaseGoogleSignIn();
      setUser({
        id: fbUser.uid,
        email: fbUser.email || '',
        name: fbUser.displayName || 'Google User',
        role: (fbUser.email?.includes('admin') || fbUser.email?.includes('coordinator')) ? 'coordinator' : 'patient',
        photoURL: fbUser.photoURL || undefined,
        authProvider: 'google'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOutUser();
    localStorage.removeItem('careconnect_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        signInWithGoogle,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
