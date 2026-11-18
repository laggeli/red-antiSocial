import styles from "./Footer.module.css";

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.contenido}>
        <p className={styles.texto}>
          <strong>UnaHur Anti-Social Net</strong>
          <span className={styles.textoInstitucional}>
            {" "}· Universidad Nacional de Hurlingham
          </span>{" "}
          © 2026
          <span className={styles.badge}>v1.0</span>
        </p>

        <div className={styles.acciones}>
          <a
            href="https://unahur.edu.ar"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            UNAHUR
          </a>
          <span className={styles.separador}>•</span>
          <a
            href="https://github.com/laggeli/red-antiSocial"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            GitHub
          </a>
          <span className={styles.separador}>•</span>
          <button
            type="button"
            onClick={scrollToTop}
            className={styles.btnSubir}
          >
            Subir ↑
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
