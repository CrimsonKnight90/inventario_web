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
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  // Persistencia del token
  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", token)
    } else {
      sessionStorage.removeItem("token")
    }
  }, [token])

  // Restaurar usuario desde token
  useEffect(() => {
    try {
      if (!token) return
      const decoded = jwtDecode(token)
      const nowSec = Math.floor(Date.now() / 1000)

      if (decoded.exp && decoded.exp < nowSec) {
        // Token expirado
        logout()
        return
      }

      setUser({ email: decoded.email || decoded.sub, role: decoded.role })
    } catch {
      // Token inválido
      logout()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = (jwt, userData) => {
    setToken(jwt)
    setUser(userData)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    sessionStorage.removeItem("token")
    navigate("/login")
  }

  const isAuthenticated = Boolean(token)
  const authHeader = () => (token ? { Authorization: `Bearer ${token}` } : {})
  const isAdmin = user?.role === "admin"
  const hasRole = (role) => user?.role === role

  return (
    <AuthContext.Provider
      value={{ token, user, login, logout, isAdmin, hasRole, isAuthenticated, authHeader }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
