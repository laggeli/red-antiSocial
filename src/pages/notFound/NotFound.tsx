import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NotFound.module.css";
import logoUnahur from "../../img/logo-unahur.png"; 

function NotFound() {
  useEffect(() => {
    document.title = "UnaHur Anti-Social Net | No encontrado";
  }, []);

  const navegar = useNavigate();
  const irAInicio = () => {
    navegar("/");
  };

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoWrapper}>
          <img
            src={logoUnahur} 
            alt="Logo UnaHur Anti-Social Net"
            className={styles.logoGirando}
          />
        </div>

        <h2 className={styles.codigo}>404</h2>
        <h3 className={styles.titulo}>Página no encontrada</h3>
        <p className={styles.descripcion}>
          Parece que esta publicación o sección no existe en UnaHur Anti-Social Net.
        </p>
        <button className={styles.btnVioleta} onClick={irAInicio}>
          Volver al inicio
        </button>
      </div>
    </main>
  );
}

export default NotFound;