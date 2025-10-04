// ============================================================
// Archivo: frontend/src/context/AuthContext.jsx
// Descripción: Contexto de autenticación con persistencia de token y restauración de usuario (React Context, react-router-dom, jwt-decode)
// Autor: CrimsonKnight90
// ============================================================

import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(sessionStorage.getItem("token") || null)
  const [user, setUser] = useState(null) // aquí guardaremos email y rol
  const navigate = useNavigate()

  // Guardar token en sessionStorage cuando cambie
  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", token)
    } else {
      sessionStorage.removeItem("token")
    }
  }, [token])

  // Restaurar usuario desde token en el primer render.
  // - Decodifica el JWT si existe y no está expirado.
  // - Si el token expiró, limpia sesión y redirige a /login.
  useEffect(() => {
    try {
      if (!token) return
      const decoded = jwtDecode(token)
      const nowSec = Math.floor(Date.now() / 1000)
      if (decoded.exp && decoded.exp < nowSec) {
        // Token expirado: limpiar y redirigir
        setToken(null)
        setUser(null)
        sessionStorage.removeItem("token")
        navigate("/login")
        return
      }
      // Poblar usuario (email en sub y rol en role según backend)
      setUser({ email: decoded.sub, role: decoded.role })
    } catch {
      // Token malformado: limpiar por seguridad
      setToken(null)
      setUser(null)
      sessionStorage.removeItem("token")
      navigate("/login")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Solo al montar; cambios posteriores de token se gestionan en login/logout

  const login = (jwt, userData) => {
    // Establece token y usuario tras iniciar sesión correctamente
    setToken(jwt)
    setUser(userData)
  }

  const logout = () => {
    // Limpia el estado de autenticación y navega a login
    setToken(null)
    setUser(null)
    sessionStorage.removeItem("token")
    navigate("/login") // redirigir al login
  }

  // Indica si hay sesión activa basada en token
  const isAuthenticated = Boolean(token)

  // Devuelve encabezados comunes de autorización para fetch/axios
  const authHeader = () => (token ? { Authorization: `Bearer ${token}` } : {})

  const isAdmin = user?.role === "admin"

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAdmin, isAuthenticated, authHeader }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
