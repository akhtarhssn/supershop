import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "superAdmin" | "admin" | "seller" | "buyer";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  address?: string;
  password?: string;
  needPasswordChange: boolean;
  passwordChangedAt?: Date;
  // forgotPasswordTokenTime?: Date;
  passwordResetVersion?: number;
  role: "superAdmin" | "admin" | "seller" | "buyer";
  status: "Active" | "Blocked";
  isDeleted: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
  setUser: (user: AuthUser) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, token) =>
        set({ user, accessToken: token, isAuthenticated: true }),

      setAccessToken: (token) => set({ accessToken: token }),

      logout: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),

      setUser: (user) => set({ user }),
    }),
    {
      name: "auth-storage",
      // Only persist token and user, not transient state
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
