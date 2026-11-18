
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { User } from "../../context/AuthContext";
import styles from "./Login.module.css";
import { API_URL } from "../../config/api";

interface FormData {
  nickName: string;
  password: string;
}

interface FormErrors {
  nickName?: string;
  password?: string;
}

interface LoginResponse {
  message: string;
  user: User;
}

export default function Login() {
  const [formData, setFormData] = useState<FormData>({
    nickName: "",
    password: "",
  });

  const [errores, setErrores] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrores((prev) => ({
      ...prev,
      [name]: undefined,
    }));

    setGeneralError("");
  };

  const validar = () => {
    const nuevosErrores: FormErrors = {};

    if (!formData.nickName.trim()) {
      nuevosErrores.nickName = "El nombre de usuario es obligatorio.";
    }

    if (!formData.password) {
      nuevosErrores.password = "La contraseña es obligatoria.";
    }

    return nuevosErrores;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError("");

    const erroresValidacion = validar();
    setErrores(erroresValidacion);

    if (Object.keys(erroresValidacion).length > 0) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickName: formData.nickName.trim(),
          contraseña: formData.password,
        }),
      });

      const data: LoginResponse | { message?: string } =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "El usuario o la contraseña son incorrectos."
        );
      }

      if (!("user" in data) || !data.user?._id) {
        throw new Error("El servidor no devolvió los datos del usuario.");
      }

      login(data.user);
      navigate("/");
    } catch (err) {
      setGeneralError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al iniciar sesión."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1>UnaHur Anti-Social Net</h1>
          <p>Iniciá sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {generalError && (
            <div className={styles.errorAlert}>
              {generalError}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="nickName" className={styles.formLabel}>
              Nombre de usuario
            </label>

            <input
              type="text"
              id="nickName"
              name="nickName"
              className={styles.formControl}
              value={formData.nickName}
              onChange={handleChange}
              placeholder="Tu nickName"
              autoComplete="username"
              disabled={loading}
            />

            {errores.nickName && (
              <span className={styles.fieldError}>
                {errores.nickName}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              Contraseña
            </label>

            <div className={styles.passwordWrapper}>
              <input
                type={mostrarPassword ? "text" : "password"}
                id="password"
                name="password"
                className={styles.formControl}
                value={formData.password}
                onChange={handleChange}
                placeholder="Tu contraseña"
                autoComplete="current-password"
                disabled={loading}
              />

              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setMostrarPassword(!mostrarPassword)}
                aria-label={
                  mostrarPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
                title={
                  mostrarPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {mostrarPassword ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A11 11 0 0112 5c5.5 0 9 7 9 7a14 14 0 01-3.1 3.8M6.2 6.2C3.9 7.7 2 12 2 12s3.5 7 10 7c1.4 0 2.6-.3 3.7-.8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                  </svg>
                )}
              </button>
            </div>

            {errores.password && (
              <span className={styles.fieldError}>
                {errores.password}
              </span>
            )}
          </div>

          <button
            type="submit"
            className={styles.btnSubmit}
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        <div className={styles.loginFooter}>
          <p>
            ¿No tenés una cuenta?{" "}
            <Link to="/registro">Registrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
}