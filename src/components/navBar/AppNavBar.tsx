import { NavLink } from 'react-router-dom';
import styles from './AppNavBar.module.css';
import logoImg from "../../img/iconoUnahurRed.jpg";
import { Button } from "../botonGenerico/Button"; 

interface AppNavBarProps {
  onLogout: () => void;
}

export const AppNavBar = ({ onLogout }: AppNavBarProps) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.leftNav}>
        <NavLink to="/" className={styles.logoLink}>
          <div className={styles.logoBadge}>
            <img
              src={logoImg}
              alt="Logo UnaHur"
              className={styles.logoImg}
            />
          </div>
          <div className={styles.logoBrand}>
            <span className={styles.logoTitle}>UnaHur</span>
            <span className={styles.logoSubtitle}>Anti-Social Net</span>
          </div>
        </NavLink>

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

      <Button 
        to="/create-post" 
        variant="primario" 
        className={styles.btnCreatePost}
      >
        + Crear publicación
      </Button>
      </div>

      <div className={styles.rightNav}>
        <Button variant="secundario" onClick={onLogout}>
          Cerrar sesión
        </Button>
      </div>
    </nav>
  );
};

export default AppNavBar;