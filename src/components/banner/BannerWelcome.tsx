import styles from "./BannerWelcome.module.css";

export const BannerWelcome = () => {
  return (
    /* banner institucional */
    <div className={styles.banner}>
      <h1>UnaHur Anti-Social Net</h1>
      <p>La red académica para compartir publicaciones, debates e ideas en la comunidad universitaria.</p>
    </div>
  );
};