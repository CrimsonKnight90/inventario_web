import { create, type StateCreator } from "zustand";
import type { AuthToken, AuthUser, AuthCredentials } from "../types/auth.types";
import { authService } from "../services/auth.service";

type AuthState = {
  token: AuthToken | null;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
  restoreFromStorage: () => void;
};

const STORAGE_KEY = "inventario_auth_v1";

/**
 * Lightweight persistence: store only what is necessary. Do not store secrets unencrypted in production.
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  loading: false,
  error: null,
  login: async (credentials: AuthCredentials) => {
    set({ loading: true, error: null });
    try {
      const { token, user } = await authService.login(credentials);
      set({ token, user, loading: false, error: null });
      try {
        const payload = {
          token,
          user,
          saved_at: Date.now(),
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // ignore storage errors
      }
    } catch (err: any) {
      const msg = err?.response?.data?.detail ?? err?.message ?? "Login failed";
      set({ error: String(msg), loading: false });
      throw err;
    }
  },
  logout: async () => {
    const { token } = get();
    set({ loading: true, error: null });
    try {
      if (token?.access_token) {
        await authService.logout(token.access_token).catch(() => {
          /* ignore server logout errors */
        });
      }
    } finally {
      sessionStorage.removeItem(STORAGE_KEY);
      set({ token: null, user: null, loading: false, error: null });
    }
  },
  restoreFromStorage: () => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { token: AuthToken; user: AuthUser; saved_at: number };
      // Basic expiry check (optional): skip if token expired (not implemented without exp)
      if (!parsed?.token) return;
      set({ token: parsed.token, user: parsed.user });
    } catch {
      // ignore parse errors
    }
  },
}));
