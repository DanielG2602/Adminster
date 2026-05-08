"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  clearSession,
  getAccessToken,
  getStoredUser,
  hasLegacyMockSession,
  login,
  logout,
  type LoginPayload
} from "@/services/auth-service";
import type { User } from "@/types";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (payload: LoginPayload) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (hasLegacyMockSession()) {
      clearSession();
      setIsLoading(false);
      return;
    }

    const storedUser = getStoredUser();
    if (storedUser && getAccessToken()) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      setUser(response.user);
      router.replace("/dashboard");
    }
  });

  async function signIn(payload: LoginPayload) {
    await loginMutation.mutateAsync(payload);
  }

  async function signOut() {
    await logout();
    setUser(null);
    router.replace("/login");
  }

  const value: AuthContextValue = {
    user,
    isAuthenticated: Boolean(user && getAccessToken()),
    isLoading: isLoading || loginMutation.isPending,
    signIn,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
