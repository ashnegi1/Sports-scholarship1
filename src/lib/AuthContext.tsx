import React, { createContext, useContext, useEffect, useState } from "react";
import authService from "./api/authService";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  college?: string;
  engineeringField?: string;
  yearOfStudy?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: any) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session on mount
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await authService.login(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        return { success: true };
      }
      setLoading(false);
      return result;
    } catch (error: any) {
      setLoading(false);
      return {
        success: false,
        error: error.message || "An unexpected error occurred",
      };
    }
  };

  const signUp = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    college: string;
    engineeringField: string;
    phone: string;
    yearOfStudy: string;
  }) => {
    setLoading(true);
    try {
      const userData = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        college: data.college || '',
        engineeringField: data.engineeringField || '',
        phone: data.phone || '',
        yearOfStudy: data.yearOfStudy || ''
      };
      
      const result = await authService.register(userData);
      if (result.success && result.user) {
        setUser(result.user);
        return { success: true };
      }
      setLoading(false);
      return result;
    } catch (error: any) {
      setLoading(false);
      return {
        success: false,
        error: error.message || "An unexpected error occurred",
      };
    }
  };

  const signOut = async () => {
    setLoading(true);
    authService.logout();
    setUser(null);
    setLoading(false);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
