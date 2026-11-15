import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import styles from './Login.module.css';

export default function Login() {
  const [nickName, setNickName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación de campos obligatorios
    if (!nickName.trim() || !password.trim()) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    // Validación local de la contraseña fija "123456"
    if (password !== '123456') {
      setError('Contraseña incorrecta. (Recuerda que la contraseña fija es 123456)');
      return;
    }

    setLoading(true);

    try {
      // Consulta GET /users para verificar si el usuario existe
      const response = await fetch('http://localhost:3000/users'); // Ajusta la URL de la API según corresponda
      if (!response.ok) {
        throw new Error('Error al conectar con el servidor.');
      }

      const users = await response.json();

      // Buscamos si existe un usuario cuyo nickName o username coincida
      const foundUser = users.find(
        (u) => (u.nickName || u.username)?.toLowerCase() === nickName.trim().toLowerCase()
      );

      if (!foundUser) {
        setError('El usuario ingresado no existe.');
        setLoading(false);
        return;
      }

      // Guardar en contexto global + localStorage y redirigir
      login(foundUser);
      navigate('/'); // Redirige al Feed o Home
    } catch (err) {
      setError('Ocurrió un error al intentar iniciar sesión. Inténtalo nuevamente.');
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
          {error && <div className={styles.errorAlert}>{error}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="nickName">Nombre de usuario (Nick)</label>
            <input
              type="text"
              id="nickName"
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
              placeholder="Ingresa tu usuario"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
            />
          </div>

          <button type="submit" className={styles.btnSubmit} disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className={styles.registerFooter}>
          <p>
            ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
}