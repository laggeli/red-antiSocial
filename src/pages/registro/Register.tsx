import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Register.module.css";
import { API_URL } from "../../config/api";
import AnimatedContent from "../../components/animatedContent/AnimatedContent";

interface FormData {
  nickName: string;
  nombre: string;
  email: string;
  password: string;
}

interface FormErrors {
  nickName?: string;
  nombre?: string;
  email?: string;
  password?: string;
}

interface RegisterResponse {
  message: string;
  user: {
    _id: string;
    nickName: string;
    nombre: string;
    email: string;
    fotoPerfil?: string;
  };
}

export default function Registro() {
  const [formData, setFormData] = useState<FormData>({
    nickName: "",
    nombre: "",
    email: "",
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

  const validar = (): FormErrors => {
    const nuevosErrores: FormErrors = {};

    if (formData.nickName.trim().length < 3) {
      nuevosErrores.nickName =
        "El nickname debe tener al menos 3 caracteres.";
    }

    if (formData.nombre.trim().length < 3) {
      nuevosErrores.nombre =
        "El nombre debe tener al menos 3 caracteres.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nuevosErrores.email =
        "Ingresá un correo electrónico válido.";
    }

    if (formData.password.length < 5) {
      nuevosErrores.password =
        "La contraseña debe tener al menos 5 caracteres.";
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
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickName: formData.nickName.trim(),
          nombre: formData.nombre.trim(),
          email: formData.email.trim(),
          contraseña: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const mensajeErrores = Array.isArray(data.errors)
          ? data.errors.join(" ")
          : data.error || data.message;

        throw new Error(
          mensajeErrores || "No se pudo registrar el usuario."
        );
      }

      const resultado = data as RegisterResponse;

      if (!resultado.user?._id) {
        throw new Error("El servidor no devolvió los datos del usuario.");
      }

      login(resultado.user);
      navigate("/");
    } catch (error) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al intentar registrarte."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registroContainer}>
      <AnimatedContent className={styles.registroCard} distance={100} direction="vertical"
      duration={1.5} ease="power2.out" blur={0} wipe="up" stagger={0.08}>
        <div className={styles.registroHeader}>
          <h1>UnaHur Anti-Social Net</h1>
          <p>Creá tu cuenta para ingresar</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.registroForm}>
          <AnimatedContent className={styles.formAnimation} distance={45} direction="vertical"
          duration={1} ease="power2.out" wipe="none" stagger={0.08}>
            {generalError && (
              <div className={styles.errorAlert}>
                {generalError}
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="nickName" className={styles.formLabel}>
                Nombre de usuario (nickName)
              </label>

              <input
                type="text"
                id="nickName"
                name="nickName"
                className={styles.formControl}
                value={formData.nickName}
                onChange={handleChange}
                placeholder="Ej: luna99"
                autoComplete="username"
                disabled={loading}
              />

              {errores.nickName && (
                <span className={styles.invalidFeedback}>
                  {errores.nickName}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="nombre" className={styles.formLabel}>
                Nombre completo
              </label>

              <input
                type="text"
                id="nombre"
                name="nombre"
                className={styles.formControl}
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Luna Pérez"
                autoComplete="name"
                disabled={loading}
              />

              {errores.nombre && (
                <span className={styles.invalidFeedback}>
                  {errores.nombre}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>
                Correo electrónico
              </label>

              <input
                type="email"
                id="email"
                name="email"
                className={styles.formControl}
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@unahur.edu.ar"
                autoComplete="email"
                disabled={loading}
              />

              {errores.email && (
                <span className={styles.invalidFeedback}>
                  {errores.email}
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
                  placeholder="Mínimo 5 caracteres"
                  autoComplete="new-password"
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
                <span className={styles.invalidFeedback}>
                  {errores.password}
                </span>
              )}
            </div>

            <button
              type="submit"
              className={styles.btnSubmit}
              disabled={loading}
            >
              {loading ? "Registrando..." : "Crear cuenta"}
            </button>
          </AnimatedContent>
        </form>

        <div className={styles.loginFooter}>
          <p>
            ¿Ya tenés una cuenta?{" "}
            <Link to="/login">Iniciá sesión aquí</Link>
          </p>
        </div>
      </AnimatedContent>
    </div>
  );
}