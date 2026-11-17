import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Registro.module.css';
import { API_URL } from '../../config/api';

// Los 4 campos son OBLIGATORIOS en el formulario
interface FormData {
  nickName: string;
  nombre: string;
  email: string;
  password: string;
}

// Los mensajes de error son OPCIONALES para permitir el estado inicial
interface FormErrors {
  nickName?: string;
  nombre?: string;
  email?: string;
  password?: string;
  [key: string]: string | undefined; 
}

export default function Registro() {
  const [formData, setFormData] = useState<FormData>({
    nickName: '',
    nombre: '',
    email: '',
    password: '',
  });

  const [Errores, setErrores] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Manejador del cambio en inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (Errores[name]) {
      setErrores((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Función de validación obligatoria para los 4 campos
  const Validar = (dato: FormData): FormErrors => {
    const newErrores: FormErrors = {};

    if (!dato.nickName.trim()) {
      newErrores.nickName = 'El nombre de usuario (nickName) es obligatorio';
    }

    if (!dato.nombre.trim()) {
      newErrores.nombre = 'El nombre es obligatorio';
    }

    if (!dato.email.trim()) {
      newErrores.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(dato.email)) {
      newErrores.email = 'El correo electrónico no tiene un formato válido';
    }

    if (!dato.password.trim()) {
      newErrores.password = 'La contraseña es obligatoria';
    }

    return newErrores;
  };

  // Envío del formulario al backend
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setGeneralError('');

    const validacionDeErrores = Validar(formData);
    setErrores(validacionDeErrores);

    if (Object.keys(validacionDeErrores).length === 0) {
      setLoading(true);

      try {
        // 1. Verificar si el nickName o email ya existen
        const checkRes = await fetch(`${API_URL}/users`);
        if (checkRes.ok) {
          const existingUsers = await checkRes.json();
          const userExists = existingUsers.some(
            (u: { nickName?: string; email?: string }) =>
              u.nickName?.toLowerCase() === formData.nickName.trim().toLowerCase() ||
              u.email?.toLowerCase() === formData.email.trim().toLowerCase()
          );

          if (userExists) {
            setGeneralError('El nickName o el email ya se encuentran registrados.');
            setLoading(false);
            return;
          }
        }

        // 2. Crear el nuevo usuario mediante POST
        const response = await fetch(`${API_URL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al registrar el usuario en el servidor.');
        }

        const newUser = await response.json();
        login(newUser);
        navigate('/');
      } catch (err: unknown) {
        if (err instanceof Error) {
          setGeneralError(err.message);
        } else {
          setGeneralError('Ocurrió un error inesperado al intentar registrarte.');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={styles.loginContainer || styles.registroContainer}>
      <div className={styles.loginCard || styles.registroCard}>
        <div className={styles.loginHeader || styles.registroHeader}>
          <h1>UnaHur Anti-Social Net</h1>
          <p>Creá tu cuenta para ingresar</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm || styles.registroForm}>
          {generalError && (
            <div className={styles.errorAlert}>{generalError}</div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="nickName">Nombre de usuario (nickName)</label>
            <input
              type="text"
              id="nickName"
              name="nickName"
              value={formData.nickName}
              onChange={handleChange}
              placeholder="Ej: luna99"
              disabled={loading}
            />
            {Errores.nickName && (
              <span className={styles.fieldError}>{Errores.nickName}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="nombre">Nombre Completo</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Luna Pérez"
              disabled={loading}
            />
            {Errores.nombre && (
              <span className={styles.fieldError}>{Errores.nombre}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@unahur.edu.ar"
              disabled={loading}
            />
            {Errores.email && (
              <span className={styles.fieldError}>{Errores.email}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••"
              disabled={loading}
            />
            {Errores.password && (
              <span className={styles.fieldError}>{Errores.password}</span>
            )}
          </div>

          <button type="submit" className={styles.btnSubmit} disabled={loading}>
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className={styles.loginFooter || styles.registroFooter}>
          <p>¿Ya tenés una cuenta? <Link to="/login">Iniciá sesión aquí</Link></p>
        </div>
      </div>
    </div>
  );
}