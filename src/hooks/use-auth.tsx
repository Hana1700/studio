'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AUTH_KEY = 'annuaire-auth-status';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { username: string } | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = () => {
     try {
        const authData = localStorage.getItem(AUTH_KEY);
        if (authData) {
            const parsedData = JSON.parse(authData);
            if(parsedData.isAuthenticated) {
                setIsAuthenticated(true);
                setUser({ username: parsedData.username });
            } else {
                setIsAuthenticated(false);
                setUser(null);
                localStorage.removeItem(AUTH_KEY);
            }
        } else {
            setIsAuthenticated(false);
            setUser(null);
        }
    } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
        try {
            localStorage.setItem(AUTH_KEY, JSON.stringify({ isAuthenticated: true, username: data.username }));
        } catch (error) {
            // local storage not available
        }
        setIsAuthenticated(true);
        setUser({ username: data.username });
        return { success: true };
    } else {
        return { success: false, error: data.error };
    }
  };

  const logout = () => {
    try {
        localStorage.removeItem(AUTH_KEY);
    } catch (error) {
        // local storage not available
    }
    setIsAuthenticated(false);
    setUser(null);
    router.push('/login');
  };
  
  useEffect(() => {
    try {
        const authData = localStorage.getItem(AUTH_KEY);
        const isAuth = authData ? JSON.parse(authData).isAuthenticated : false;
        if (!isAuth && pathname.startsWith('/admin')) {
          router.push('/login');
        }
    } catch(e) {
        if (pathname.startsWith('/admin')) {
          router.push('/login');
        }
    }
  }, [pathname, router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
