import type { ReactNode } from "react";
import styles from "./PageBanner.module.css";

interface PageBannerProps {
  titulo: string;
  subtitulo?: string;
  children?: ReactNode; // Por si en Explorar querés meter el buscador adentro
  className?: string;
}

export const PageBanner = ({
  titulo,
  subtitulo,
  children,
  className = "",
}: PageBannerProps) => {
  return (
    <header className={`${styles.banner} ${className}`}>
      <div className={styles.textContainer}>
        <h1 className={styles.titulo}>{titulo}</h1>
        {subtitulo && <p className={styles.subtitulo}>{subtitulo}</p>}
      </div>
      {children && <div className={styles.extraContent}>{children}</div>}
    </header>
  );
};

export default PageBanner;
