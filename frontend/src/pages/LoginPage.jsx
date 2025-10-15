// ============================================================
// Archivo: frontend/src/pages/LoginPage.jsx
// Descripción: Pantalla de login multilenguaje; obtiene token JWT, lo decodifica y establece sesión
// Autor: CrimsonKnight90
// ============================================================

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { API_URL } from "../config"
import { useTranslation } from "react-i18next"
import "../i18n" // inicialización de i18next
import LanguageSwitcher from "../components/LanguageSwitcher" // ✅ nuevo import

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")

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

      // Backend envía: sub = user_id, email = correo, role = rol
      login(data.access_token, { email: decoded.email, role: decoded.role })
      navigate("/dashboard")
    } catch (err) {
      setError(err.message || t("login.error"))
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          🔐 {t("login.title")}
        </h1>
        {error && <p className="mb-4 text-red-600 text-sm text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder={t("login.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder={t("login.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {t("login.button")}
          </button>
        </form>

        {/* ✅ Selector de idioma reutilizable */}
        <LanguageSwitcher />
      </div>
    </div>
  )
}
