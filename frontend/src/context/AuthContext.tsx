import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../services/userService';
import { Permission } from '../services/roleService';
import authService from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  hasPermission: (resource: string, action: string) => boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // You would typically verify the token with the backend here
          const currentUser = await authService.getProfile();
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (token: string) => {
    localStorage.setItem('token', token);
    try {
      setLoading(true);
      const currentUser = await authService.getProfile();
      setUser(currentUser);
    } catch (error) {
      console.error("Failed to login:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user || !user.role) {
      return false;
    }

    // Super Admin has all permissions
    if (user.role.name === 'Super Admin') {
      return true;
    }

    if (!user.role.permissions) {
      return false;
    }

    return user.role.permissions.some(
      (p: Permission) => p.resource === resource && p.action === action
    );
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, hasPermission, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 