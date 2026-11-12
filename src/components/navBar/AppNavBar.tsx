import { NavLink } from 'react-router-dom';
import styles from './AppNavBar.module.css';

interface AppNavBarProps {
  onLogout: () => void;
}

export const AppNavBar = ({ onLogout }: AppNavBarProps) => {
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

        <NavLink 
          to="/create-post"
          className={styles.btnCreatePost}
        >
          + Crear post
        </NavLink>
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