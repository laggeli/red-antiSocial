
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { User as AuthUser } from "../../context/AuthContext";
import styles from "./Login.module.css";
import { API_URL } from "../../config/api";

interface FormErrors {
  nickName?: string;
  password?: string;
  [key: string]: string | undefined;
}

interface FormData {
  nickName: string;
  password: string;
}

export default function Login() {
  const [formData, setFormData] = useState<FormData>({
    nickName: "",
    password: "",
  });

  const [Errores, setErrores] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (Errores[name]) {
      setErrores({
        ...Errores,
        [name]: "",
      });
    }
  };

  const Validar = (dato: FormData) => {
    const newErrores: FormErrors = {};

    if (!dato.nickName.trim()) {
      newErrores.nickName = "El nombre de usuario es obligatorio";
    }

    if (!dato.password.trim()) {
      newErrores.password = "La contraseña es obligatoria";
    } else if (dato.password !== "123456") {
      newErrores.password = "La contraseña es incorrecta (debe ser 123456)";
    }

    return newErrores;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError("");

    const validacionDeErrores = Validar(formData);
    setErrores(validacionDeErrores);

    if (Object.keys(validacionDeErrores).length !== 0) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/users`);

      if (!response.ok) {
        throw new Error("Error al conectar con el servidor");
      }

      const users: AuthUser[] = await response.json();

      const foundUser = users.find(
        (u) =>
          u.nickName?.toLowerCase() ===
          formData.nickName.trim().toLowerCase()
      );

      if (!foundUser) {
        setGeneralError("El usuario ingresado no existe");
        return;
      }

      login(foundUser);
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setGeneralError(err.message);
      } else {
        setGeneralError("Error al intentar iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1>UnaHur Anti-Social Net</h1>
          <p>Inicia sesión para continuar</p>
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

            {Errores.nickName && (
              <span className={styles.fieldError}>
                {Errores.nickName}
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
              placeholder="••••••"
              autoComplete="current-password"
              disabled={loading}
            />

            {Errores.password && (
              <span className={styles.fieldError}>
                {Errores.password}
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
            ¿No tienes una cuenta?{" "}
            <Link to="/registro">Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
}