// ============================================================
// Archivo: frontend/src/pages/LoginPage.jsx
// Descripción: Pantalla de login multilenguaje con diseño profesional
// Autor: CrimsonKnight90
// ============================================================

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { API_URL } from "../config"
import { useTranslation } from "react-i18next"
import "../i18n"
import LanguageSwitcherDropdown from "../components/LanguageSwitcherDropdown"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      })

      if (!response.ok) {
        const msg = response.status === 401 ? t("login.error") : `Error ${response.status}`
        throw new Error(msg)
      }

      const data = await response.json()
      const decoded = jwtDecode(data.access_token)

      // 🔑 Guardar token en sessionStorage para que apiClient lo use
      sessionStorage.setItem("token", data.access_token)

      // Actualizar contexto de auth
      login(data.access_token, { email: decoded.email || decoded.sub, role: decoded.role })

      navigate("/dashboard")
    } catch (err) {
      setError(err.message || t("login.error"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 relative">
      <div className="absolute top-4 right-4">
        <LanguageSwitcherDropdown variant="text" />
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">
          🔐 {t("login.title")}
        </h1>
        <p className="text-center text-gray-500 mb-6">
          {t("login.subtitle", { defaultValue: "Accede a tu cuenta para continuar" })}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded border border-red-300 bg-red-100 text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder={t("login.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <span className="absolute left-3 top-2.5 text-gray-400">📧</span>
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder={t("login.password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔒</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex justify-center items-center"
          >
            {loading ? "⏳" : t("login.button")}
          </button>
        </form>
      </div>
    </div>
  )
}
