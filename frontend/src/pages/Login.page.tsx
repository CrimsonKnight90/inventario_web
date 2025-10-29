// ============================================================
// Archivo: frontend/src/pages/Login.page.tsx
// Descripción: Página de inicio de sesión.
//              CORREGIDO: Limpia errores al reintentar login
//              y previene loops infinitos.
// Autor: CrimsonKnight90
// ============================================================

import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@store/auth.store";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { TextInput } from "@ui/TextInput";
import { Button } from "@ui/Button";

const schema = z.object({
  email: z.string().min(5).email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

type FormValues = z.infer<typeof schema>;

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="max-w-md w-full p-4 bg-red-50 border border-red-200 text-red-700 rounded">
      <strong className="block font-medium mb-1">Error</strong>
      <div className="text-sm break-words">{message}</div>
    </div>
  );
}

export const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname ?? "/dashboard";

  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const storeError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const [runtimeError, setRuntimeError] = useState<string | null>(null);

  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  // Limpiar errores al montar
  useEffect(() => {
    clearError();
    setRuntimeError(null);
  }, [clearError]);

  async function onSubmit(data: FormValues) {
    setRuntimeError(null);
    clearError();

    try {
      await login({ email: data.email, password: data.password });
      navigate(from, { replace: true });
    } catch (e: any) {
      const msg = e?.message || t("auth.invalid_credentials");
      setRuntimeError(msg);
    }
  }

  if (runtimeError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-lg space-y-4">
          <ErrorBox message={runtimeError} />
          <button
            onClick={() => {
              setRuntimeError(null);
              clearError();
            }}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-6 bg-white rounded-lg shadow"
      >
        <h1 className="text-2xl font-semibold mb-4">{t("auth.login")}</h1>

        <TextInput
          label={t("auth.email")}
          {...register("email")}
          type="email"
          autoComplete="email"
          error={formState.errors.email?.message}
        />

        <div className="mt-3" />

        <TextInput
          label={t("auth.password")}
          {...register("password")}
          type="password"
          autoComplete="current-password"
          error={formState.errors.password?.message}
        />

        {storeError && (
          <p className="text-red-600 text-sm mt-2">{storeError}</p>
        )}

        <Button type="submit" disabled={loading} className="w-full mt-4" block>
          {loading ? "Cargando..." : t("auth.submit")}
        </Button>
      </form>
    </div>
  );
};

export default Login;