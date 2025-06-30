import React, { createContext, useContext, useEffect, useState } from "react";
import { MockAuthService, MockUser } from "@/lib/mockAuth";

interface AuthContextType {
  user: MockUser | null;
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
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session on mount
    const currentUser = MockAuthService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await MockAuthService.signIn(email, password);
      if (result.success && result.user) {
        setUser(result.user);
      }
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: "An unexpected error occurred",
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
  }) => {
    setLoading(true);
    try {
      const result = await MockAuthService.signUp(data);
      if (result.success && result.user) {
        setUser(result.user);
      }
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  };

  const signOut = async () => {
    setLoading(true);
    await MockAuthService.signOut();
    setUser(null);
    setLoading(false);
  };

  const isAuthenticated = !!user;
  const isAdmin = MockAuthService.isAdmin(user);

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
