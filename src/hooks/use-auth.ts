'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AUTH_KEY = 'annuaire-auth-status';
const ADMIN_PASSWORD = 'admin'; // Simple hardcoded password

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
        const isAuth = localStorage.getItem(AUTH_KEY) === 'true';
        setIsAuthenticated(isAuth);
    } catch (error) {
        // localStorage is not available
        setIsAuthenticated(false);
    }
  }, []);

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      try {
        localStorage.setItem(AUTH_KEY, 'true');
      } catch (error) {
        // localStorage is not available
      }
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    try {
        localStorage.removeItem(AUTH_KEY);
    } catch (error) {
        // localStorage is not available
    }
    setIsAuthenticated(false);
    router.push('/login');
  };
  
  useEffect(() => {
    const isAuth = localStorage.getItem(AUTH_KEY) === 'true';
    if (!isAuth && pathname === '/admin') {
      router.push('/login');
    }
  }, [pathname, router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
