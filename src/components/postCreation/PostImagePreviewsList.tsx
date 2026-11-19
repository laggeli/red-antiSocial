import { XLg } from "react-bootstrap-icons";
import ButtonIcon from "../botonGenerico/ButtonIcon";
import styles from "./Posts.module.css";
import errorImageIcon from "../../img/image-notFound.jpg";
import type { PostImagePreviewsListProps } from "../../types/PostTypes";

export const PostImagePreviewsList = ({
  imagenesUrls,
  archivos,
  previews,
  urlsRotas,
  onImageError,
  onEliminarUrl,
  onEliminarArchivo,
}: PostImagePreviewsListProps) => {
  if (imagenesUrls.length === 0 && archivos.length === 0) return null;

  return (
    <div className={styles.previewsGrid}>
      {imagenesUrls.map((url, index) => (
        <div key={`${url}-${index}`} className={styles.previewItem}>
          <img
            src={urlsRotas[url] ? errorImageIcon : url}
            alt="Vista previa"
            className={styles.previewImg}
            onError={() => onImageError(url)}
          />

          <ButtonIcon
            variant="flotante"
            icon={<XLg size={13} />}
            onClick={() => onEliminarUrl(index)}
            title="Quitar imagen"
            aria-label="Eliminar imagen"
          />

        </div>
      ))}

      {archivos.map((archivo, index) => (
        <div key={`${archivo.name}-${index}`} className={styles.previewItem}>
          <img
            src={previews[index]}
            alt={archivo.name}
            className={styles.previewImg}
          />

          <ButtonIcon
            variant="flotante"
            icon={<XLg size={13} />}
            onClick={() => onEliminarArchivo(index)}
            title="Quitar imagen"
            aria-label="Eliminar imagen"
          />

        </div>
      ))}
    </div>
  );
};

export default PostImagePreviewsList;