import { PostImageUrlInput } from "./PostImageUrlInput";
import { PostImageFileSelector } from "./PostImageFileSelector";
import { PostImagePreviewsList } from "./PostImagePreviewsList";
import styles from "./Posts.module.css";
import cameraIcon from "../../img/camara.png";
import type { PostImageDropzoneProps } from "../../types/PostTypes";

export const PostImageDropzone = ({
  inputUrlImagen,
  onInputUrlChange,
  onKeyDownUrl,
  onAgregarUrl,
  onSeleccionArchivos,
  disponibles,
  maxImagenes = 5,
  urlInputRef,
  archivoInputRef,
  imagenesUrls,
  archivos,
  previews,
  urlsRotas,
  onImageError,
  onEliminarUrl,
  onEliminarArchivo,
}: PostImageDropzoneProps) => {
  return (
    <div className={styles.dropzone}>
      <div className={styles.dropzonePrompt}>
        <img
          src={cameraIcon}
          alt="Agregar imágenes"
          className={styles.iconoCamara}
        />

        <p className={styles.dropzoneTexto}>
          {maxImagenes > 0
            ? `Agregá imágenes a tu publicación (máx. ${maxImagenes})`
            : "Ya alcanzaste el máximo de 5 imágenes permitidas"
          }
        </p>

        <PostImageUrlInput
          inputUrlImagen={inputUrlImagen}
          onInputUrlChange={onInputUrlChange}
          onKeyDownUrl={onKeyDownUrl}
          onAgregarUrl={onAgregarUrl}
          disponibles={disponibles}
          urlInputRef={urlInputRef}
        />

        <PostImageFileSelector
          archivoInputRef={archivoInputRef}
          onSeleccionArchivos={onSeleccionArchivos}
          disponibles={disponibles}
        />

        <small className={styles.textoAyudaImagenes}>
          JPG, PNG, WEBP o GIF. Máximo 5 MB por imagen.
        </small>
      </div>
      {/* Las previsualizaciones quedan encapsuladas dentro del mismo dropzone */}
      <PostImagePreviewsList
        imagenesUrls={imagenesUrls}
        archivos={archivos}
        previews={previews}
        urlsRotas={urlsRotas}
        onImageError={onImageError}
        onEliminarUrl={onEliminarUrl}
        onEliminarArchivo={onEliminarArchivo}
      />
    </div>
  );
};

export default PostImageDropzone;