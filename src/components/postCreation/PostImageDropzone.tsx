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
          Agregá imágenes a tu publicación (máx. 5)
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