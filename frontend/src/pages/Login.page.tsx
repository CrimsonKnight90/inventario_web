// src/pages/Login.page.tsx

import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@store/auth.store";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { TextInput } from "@ui/TextInput";
import { Button } from "@ui/Button";

// Esquema de validación con Zod
const schema = z.object({
  email: z.string().min(5).email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

// Componente para mostrar errores en runtime
function ErrorBox({ message }: { message: string }) {
  return (
    <div className="max-w-md w-full p-4 bg-red-50 border border-red-200 text-red-700 rounded">
      <strong className="block font-medium mb-1">Runtime error</strong>
      <div className="text-sm break-words">{message}</div>
    </div>
  );
}

/**
 * Página de Login.
 * - Valida credenciales con Zod + react-hook-form.
 * - Usa el store de autenticación para login.
 * - Redirige al dashboard si el login es exitoso.
 */
export const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname ?? "/dashboard";

  // Acceso al store de autenticación
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

  // Estado para errores en runtime
  const [runtimeError, setRuntimeError] = useState<string | null>(null);

  // Verificar que el store esté disponible
  useEffect(() => {
    try {
      if (!login || typeof login !== "function") {
        setRuntimeError("Auth store no disponible. Revisa el import y la build (useAuthStore).");
      }
    } catch (e: any) {
      setRuntimeError(String(e?.message ?? e));
    }
  }, [login]);

  // Configuración del formulario con validación
  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  // Manejar envío del formulario
  async function onSubmit(data: FormValues) {
    try {
      await login({ email: data.email, password: data.password });
      navigate(from, { replace: true });
    } catch (e: any) {
      const msg =
        e?.response?.status === 401
          ? t("auth.invalid_credentials")
          : e?.response?.data?.detail ?? e?.message ?? String(e);
      setRuntimeError(String(msg));
    }
  }

  // Mostrar error de runtime si existe
  if (runtimeError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-lg">
          <ErrorBox message={runtimeError} />
          <div className="mt-4 text-sm text-gray-600">
            Revisa la consola del navegador y la terminal donde ejecutas Vite para detalles.
          </div>
        </div>
      </div>
    );
  }

  // Render del formulario de login
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-6 bg-white rounded-lg shadow"
      >
        {/* Título */}
        <h1 className="text-2xl font-semibold mb-4">{t("auth.login")}</h1>

        {/* Campo email */}
        <TextInput
          label={t("auth.email")}
          {...register("email")}
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!formState.errors.email}
        />
        {formState.errors.email && (
          <p className="text-red-600 text-sm">
            {String(formState.errors.email.message)}
          </p>
        )}

        <div className="mt-3" />

        {/* Campo password */}
        <TextInput
          label={t("auth.password")}
          {...register("password")}
          name="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!formState.errors.password}
        />
        {formState.errors.password && (
          <p className="text-red-600 text-sm">
            {String(formState.errors.password.message)}
          </p>
        )}

        {/* Error de autenticación */}
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        {/* Botón de submit */}
        <Button type="submit" disabled={loading} className="w-full mt-4" block>
          {loading ? "..." : t("auth.submit")}
        </Button>
      </form>
    </div>
  );
};

export default Login;
