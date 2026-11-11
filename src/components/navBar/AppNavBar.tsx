import { NavLink, useNavigate } from 'react-router-dom';
import styles from './AppNavBar.module.css';

interface AppNavBarProps {
  onLogout?: () => void;
}

export const AppNavBar = ({ onLogout }: AppNavBarProps) => {
  const navigate = useNavigate();

  return (
    <nav className={styles.navbar}>
      <div className={styles.leftNav}>
        <NavLink 
          to="/" 
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
        >
          Inicio
        </NavLink>

        <NavLink 
          to="/explore" 
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
        >
          Explorar
        </NavLink>

        <NavLink 
          to="/profile" 
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
        >
          Mi perfil
        </NavLink>

        <button 
          className={styles.btnCreatePost}
          onClick={() => navigate('/create-post')}
        >
          + Crear post
        </button>
      </div>

      <div className={styles.rightNav}>
        <button className={styles.btnLogout} onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default AppNavBar;