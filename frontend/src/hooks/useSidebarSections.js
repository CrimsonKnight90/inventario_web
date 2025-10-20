// ============================================================
// Archivo: frontend/src/hooks/useSidebarSections.js
// Descripción: Hook que devuelve la estructura del sidebar con i18n, permisos,
//              y estados de carga/error. Memoiza el resultado para evitar recomputos.
// Autor: CrimsonKnight90
// ============================================================

import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { sidebarSections } from "../data/SidebarSections";

/**
 * useSidebarSections
 * - Devuelve { sections, loading, error }
 * - loading es true mientras se resuelven dependencias (i18n/auth) o se calcula la estructura.
 * - error contiene el error si ocurre al construir las secciones.
 */
export function useSidebarSections() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sections = useMemo(() => {
    // Guards: si t no está listo o auth no autenticó, devolvemos array vacío pero consideramos loading
    if (typeof t !== "function") return [];
    if (!isAuthenticated) return [];
    try {
      const result = sidebarSections(t, user, isAuthenticated) || [];
      return result;
    } catch (err) {
      // Devolver [] para que el render no rompa; el error se expone en state
      setError(err);
      return [];
    }
    // dependencias intencionales
  }, [t, user, isAuthenticated]);

  useEffect(() => {
    if (typeof t !== "function") {
      setLoading(true);
      setError(null);
      return;
    }
    if (!isAuthenticated) {

      setLoading(false);
      setError(null);
      return;
    }
    setLoading(false);
    setError(null);
  }, [t, isAuthenticated, sections]);

  return { sections, loading, error };
}
