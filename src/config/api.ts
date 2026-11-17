export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const obtenerUrlImagen = (url?: string): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};