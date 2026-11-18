
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
  };

  const validar = () => {
    const nuevosErrores: FormErrors = {};

    if (!formData.nickName.trim()) {
      nuevosErrores.nickName = "El nombre de usuario es obligatorio";
    }

    if (!formData.password.trim()) {
      nuevosErrores.password = "La contraseña es obligatoria";
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
          data.message || "No se pudo iniciar sesión."
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

            <input
              type="password"
              id="password"
              name="password"
              className={styles.formControl}
              value={formData.password}
              onChange={handleChange}
              placeholder="Tu contraseña"
              autoComplete="current-password"
              disabled={loading}
            />

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
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
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