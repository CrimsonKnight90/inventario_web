import axios, { type AxiosInstance, AxiosError } from "axios";
import type { AuthCredentials, AuthToken, AuthUser } from "../types/auth.types";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export class AuthService {
  private http: AxiosInstance;

  constructor(baseURL = API_BASE) {
    this.http = axios.create({
      baseURL,
      timeout: 10_000,
    });
  }

  /**
   * Login con credenciales. Envía form-urlencoded como espera FastAPI.
   * Devuelve token y perfil de usuario (consultado en /auth/me).
   * Incluye manejo explícito de errores para distinguir 401/422 de fallos de red.
   */
  async login(credentials: AuthCredentials): Promise<{ token: AuthToken; user: AuthUser }> {
    try {
      // Construir payload form-urlencoded
      const payload = new URLSearchParams();
      payload.append("username", credentials.email); // aunque uses email, el campo se llama "username"
      payload.append("password", credentials.password);

      // Llamada a /auth/login
      const resp = await this.http.post<{
        access_token: string;
        token_type: string;
        expires_in?: number;
        refresh_token?: string;
      }>("/auth/login", payload.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const { access_token, token_type, expires_in, refresh_token } = resp.data;
      const token: AuthToken = {
        access_token,
        token_type,
        expires_in: expires_in ?? 0,
        refresh_token,
      };

      // Obtener perfil del usuario con el token
      const meResp = await this.http.get<AuthUser>("/auth/me", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const user = meResp.data;

      return { token, user };
    } catch (err) {
      const axiosErr = err as AxiosError<any>;
      if (axiosErr.response) {
        // Error devuelto por el backend
        const detail = axiosErr.response.data?.detail ?? axiosErr.response.statusText;
        throw new Error(`Login failed: ${detail}`);
      }
      // Error de red o timeout
      throw new Error(`Login failed: ${axiosErr.message}`);
    }
  }

  /**
   * Refresh token flow si el API lo expone.
   */
  async refresh(refreshToken: string): Promise<AuthToken> {
    const resp = await this.http.post<{
      access_token: string;
      token_type: string;
      expires_in: number;
      refresh_token?: string;
    }>("/auth/refresh", { refresh_token: refreshToken });
    const { access_token, token_type, expires_in, refresh_token } = resp.data;
    return { access_token, token_type, expires_in, refresh_token };
  }

  /**
   * Validar token llamando a /auth/me.
   */
  async me(accessToken: string): Promise<AuthUser> {
    const resp = await this.http.get<AuthUser>("/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return resp.data;
  }

  /**
   * Logout server-side si el endpoint existe.
   */
  async logout(accessToken: string): Promise<void> {
    await this.http.post(
      "/auth/logout",
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
  }
}

export const authService = new AuthService();
