import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Registro.module.css';

export default function Registro() {
  const [formData, setFormData] = useState({
    nickName: '',
    nombre: '',
    email: '',
    contraseña: '123456',
  });

  // Guarda los errores por campo
  const [Errores, setErrores] = useState({});
  // Controla la confirmación del estado del envío
  const [submitted, setSubmitted] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Función dinámica para actualizar cualquier campo del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Limpia el mensaje de error del campo en cuanto el usuario vuelve a escribir
    if (Errores[name]) {
      setErrores({
        ...Errores,
        [name]: '',
      });
    }
  };

  // Función de validación manual según las reglas del backend (Joi)
  const Validar = (dato) => {
    const newErrores = {};

    // Validar nickName (obligatorio, entre 3 y 20 caracteres)
    if (!dato.nickName.trim()) {
      newErrores.nickName = 'El nickName no puede estar vacío';
    } else if (dato.nickName.trim().length < 3) {
      newErrores.nickName = 'El nickName debe tener al menos 3 caracteres';
    } else if (dato.nickName.trim().length > 20) {
      newErrores.nickName = 'El nickName no puede sobrepasar los 20 caracteres';
    }

    // Validar nombre (obligatorio, entre 3 y 50 caracteres)
    if (!dato.nombre.trim()) {
      newErrores.nombre = 'El nombre no puede estar vacío';
    } else if (dato.nombre.trim().length < 3) {
      newErrores.nombre = 'El nombre debe tener al menos 3 caracteres';
    } else if (dato.nombre.trim().length > 50) {
      newErrores.nombre = 'El nombre no puede sobrepasar los 50 caracteres';
    }

    // Validar email (obligatorio y formato con @ y .)
    if (!dato.email.trim()) {
      newErrores.email = 'El email no puede estar vacío';
    } else if (!dato.email.includes('@') || !dato.email.includes('.')) {
      newErrores.email = 'Debe ser un correo electrónico válido (ejemplo@dominio.com)';
    }

    // Validar contraseña (mínimo 5 caracteres)
    if (!dato.contraseña.trim()) {
      newErrores.contraseña = 'La contraseña no puede estar vacía';
    } else if (dato.contraseña.trim().length < 5) {
      newErrores.contraseña = 'La contraseña debe tener al menos 5 caracteres';
    }

    return newErrores;
  };

  // Manejador del evento onSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    const validacionDeErrores = Validar(formData);
    setErrores(validacionDeErrores);

    // Si el objeto de errores está vacío, el formulario es válido
    if (Object.keys(validacionDeErrores).length === 0) {
      setSubmitted(true);
      setLoading(true);

      try {
        const response = await fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nickName: formData.nickName.trim(),
            nombre: formData.nombre.trim(),
            email: formData.email.trim(),
            contraseña: formData.contraseña,
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.error || data.message || 'Error al registrar el usuario');
        }

        const userToSave = data.user || {
          nickName: formData.nickName.trim(),
          nombre: formData.nombre.trim(),
          email: formData.email.trim(),
        };

        login(userToSave);
        navigate('/');
      } catch (err) {
        setGeneralError(err.message || 'Ocurrió un error inesperado al registrar el usuario');
        setSubmitted(false);
      } finally {
        setLoading(false);
      }
    } else {
      setSubmitted(false);
    }
  };

  return (
    <div className={styles.registroContainer}>
      <div className={styles.registroCard}>
        <div className={styles.registroHeader}>
          <h1>Crear una cuenta</h1>
          <p>Únete a UnaHur Anti-Social Net</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.registroForm}>
          {/* Alerta de éxito tras el envío válido */}
          {submitted && !generalError && (
            <div className={styles.successAlert}>
              ¡Registro exitoso! Iniciando sesión...
            </div>
          )}

          {/* Alerta de error proveniente del servidor */}
          {generalError && (
            <div className={styles.errorAlert}>
              {generalError}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="nickName">Nombre de usuario</label>
            <input
              type="text"
              id="nickName"
              name="nickName"
              value={formData.nickName}
              onChange={handleChange}
              placeholder="Tu nickName"
              disabled={loading}
            />
            {Errores.nickName && <span className={styles.fieldError}>{Errores.nickName}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="nombre">Nombre completo</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              disabled={loading}
            />
            {Errores.nombre && <span className={styles.fieldError}>{Errores.nombre}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              disabled={loading}
            />
            {Errores.email && <span className={styles.fieldError}>{Errores.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="contraseña">Contraseña</label>
            <input
              type="password"
              id="contraseña"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              disabled={loading}
            />
            {Errores.contraseña && <span className={styles.fieldError}>{Errores.contraseña}</span>}
          </div>

          <button type="submit" className={styles.btnSubmit} disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className={styles.loginFooter}>
          <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
        </div>
      </div>
    </div>
  );
}