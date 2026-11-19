
import { NavLink } from "react-router-dom";
import styles from "./AppNavBar.module.css";
import logoImg from "../../img/iconoUnahurRed.jpg";
import { Button } from "../botonGenerico/Button";
import { useTheme } from "../../context/ThemeContext";

interface UserData {
  nickName?: string;
  name?: string;
}

interface AppNavBarProps {
  user?: UserData;
  onLogout: () => void;
}

export const AppNavBar = ({ user, onLogout }: AppNavBarProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={styles.navbar}>
      <div className={styles.leftNav}>
        <NavLink to="/" className={styles.logoLink}>
          <div className={styles.logoBadge}>
            <img
              src={logoImg}
              alt="Logo Red UnaHur"
              className={styles.logoImg}
            />
          </div>

          <div className={styles.logoBrand}>
            <span className={styles.logoTitle}>UnaHur</span>
            <span className={styles.logoSubtitle}>Anti-Social Net</span>
          </div>
        </NavLink>
      </div>

      <div className={styles.centerNav}>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`
          }
        >
          Inicio
        </NavLink>

        <NavLink
          to="/explore"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`
          }
        >
          Explorar
        </NavLink>

        <NavLink
          to="/profile"
          end
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`
          }
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
        <span className={styles.saludo}>
          Bienvenido/a, @{user?.nickName || user?.name || "usuario"}
        </span>

        <Button variant="secundario" onClick={onLogout}>
          Cerrar sesión
        </Button>

        <button
          type="button"
          className={styles.themeButton}
          onClick={toggleTheme}
          aria-label={
            theme === "light"
              ? "Activar modo oscuro"
              : "Activar modo claro"
          }
          title={theme === "light" ? "Modo oscuro" : "Modo claro"}
        >
          {theme === "light" ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z" />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
};

export default AppNavBar;