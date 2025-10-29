// ============================================================
// Archivo: frontend/src/store/auth.store.ts
// Descripción: Store de autenticación con Zustand.
//              CORREGIDO: Agregada validación de token expirado
//              y manejo robusto de errores.
// Autor: CrimsonKnight90
// ============================================================

import { create } from "zustand";
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
  clearError: () => void;
  isTokenValid: () => boolean;
};

const STORAGE_KEY = "inventario_auth_v1";

/**
 * Valida si el token está presente y no ha expirado
 */
function validateToken(token: AuthToken | null): boolean {
  if (!token?.access_token) return false;
  
  // Si no hay expires_in, asumimos que es válido (mejora futura: decodificar JWT)
  if (!token.expires_in) return true;
  
  const savedAt = parseInt(sessionStorage.getItem(`${STORAGE_KEY}_time`) || "0");
  if (!savedAt) return true;
  
  const now = Date.now();
  const expiresAt = savedAt + (token.expires_in * 1000);
  
  return now < expiresAt;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  loading: false,
  error: null,

  isTokenValid: () => {
    const { token } = get();
    return validateToken(token);
  },

  clearError: () => set({ error: null }),

  login: async (credentials: AuthCredentials) => {
    set({ loading: true, error: null });
    try {
      const { token, user } = await authService.login(credentials);
      
      set({ token, user, loading: false, error: null });
      
      try {
        const payload = { token, user, saved_at: Date.now() };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        sessionStorage.setItem(`${STORAGE_KEY}_time`, String(Date.now()));
      } catch (storageErr) {
        console.warn("No se pudo guardar en sessionStorage:", storageErr);
      }
    } catch (err: any) {
      const msg = err?.message ?? "Error desconocido al iniciar sesión";
      set({ error: msg, loading: false, token: null, user: null });
      throw err;
    }
  },

  logout: async () => {
    const { token } = get();
    set({ loading: true, error: null });
    
    try {
      if (token?.access_token) {
        await authService.logout(token.access_token).catch((err) => {
          console.warn("Error al cerrar sesión en servidor:", err);
        });
      }
    } finally {
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(`${STORAGE_KEY}_time`);
      set({ token: null, user: null, loading: false, error: null });
    }
  },

  restoreFromStorage: () => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      
      const parsed = JSON.parse(raw) as { 
        token: AuthToken; 
        user: AuthUser; 
        saved_at: number 
      };
      
      if (!parsed?.token || !validateToken(parsed.token)) {
        sessionStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(`${STORAGE_KEY}_time`);
        return;
      }
      
      set({ token: parsed.token, user: parsed.user });
    } catch (err) {
      console.warn("Error al restaurar sesión:", err);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  },
}));