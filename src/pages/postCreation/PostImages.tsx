import { useState, useRef } from "react";
import type { KeyboardEvent } from "react";
import styles from "./Posts.module.css";
import cameraIcon from "../../img/camara.png";
import errorImageIcon from "../../img/imagen-error.jpg";

const MAX_IMAGENES = 5;

interface PostImagesProps {
  imagenesUrls: string[];
  onChangeImagenes: (nuevasUrls: string[]) => void;
  onUrlsInvalidasChange?: (urlsInvalidas: string[]) => void;
}

export const PostImages = ({
  imagenesUrls,
  onChangeImagenes,
  onUrlsInvalidasChange,
}: PostImagesProps) => {
  const urlInputRef = useRef<HTMLInputElement | null>(null);

  const [inputUrlImagen, setInputUrlImagen] = useState<string>("");
  const [errorImagenes, setErrorImagenes] = useState<string>("");

  //Record, objeto tipo diccionario, lo uso para marcar con true las URLs que fallaron al cargarse, reemplazarlas por la imagen de error en pantalla y filtrarlas antes de enviar el formulario al backend.
  const [urlsRotas, setUrlsRotas] = useState<Record<string, boolean>>({}); 

  const enfocarInputUrl = () => {
    urlInputRef.current?.focus();
  };

  const notificarInvalidas = (mapaRotas: Record<string, boolean>) => {
    onUrlsInvalidasChange?.(
      Object.keys(mapaRotas).filter((url) => mapaRotas[url])
    );
  };

  const agregarUrlImagen = () => {
    const limpia = inputUrlImagen.trim();
    if (!limpia) return;

    if (imagenesUrls.length >= MAX_IMAGENES) {
      setErrorImagenes(`Solo puedes agregar un máximo de ${MAX_IMAGENES} imágenes.`);
      enfocarInputUrl();
      return;
    }

    if (imagenesUrls.includes(limpia)) {
      setErrorImagenes("Esa URL de imagen ya fue agregada. Ingresa una distinta.");
      enfocarInputUrl();
      return;
    }

    setErrorImagenes("");
    onChangeImagenes([...imagenesUrls, limpia]);
    setInputUrlImagen("");
  };

  const handleKeyDownUrl = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      agregarUrlImagen();
    }
  };

  const eliminarImagen = (indexEliminar: number) => {
    const urlEliminada = imagenesUrls[indexEliminar];
    const nuevas = imagenesUrls.filter((_, i) => i !== indexEliminar);
    onChangeImagenes(nuevas);

    setUrlsRotas((prev) => {
      const copia = { ...prev };
      delete copia[urlEliminada];
      return copia;
    });
    setErrorImagenes("");
  };

  const handleImageError = (url: string, index: number) => {
    setUrlsRotas((prev) => {
      const actualizado = { ...prev, [url]: true };
      notificarInvalidas(actualizado);
      return actualizado;
    });
    setErrorImagenes(
      `La imagen ${index + 1} no cargó. Verifica que sea un enlace directo a la imagen (clic derecho sobre la imagen elegida → 'Copiar dirección de imagen').`
    );
    enfocarInputUrl();
  };

  return (
    <div className={styles.campoGrupo}>
      <div
        className={`${styles.dropzone} ${
          errorImagenes ? styles.dropzoneError : ""
        }`}
      >
        <div className={styles.dropzonePrompt}>
          <img
            src={cameraIcon}
            alt="Agregar imágenes"
            className={styles.iconoCamara}
          />
          <p className={styles.dropzoneTexto}>
            Agrega URLs de imágenes (máx. {MAX_IMAGENES})
          </p>

          {imagenesUrls.length < MAX_IMAGENES && (
            <div className={styles.urlInputRow}>
              <input
                ref={urlInputRef}
                type="text"
                className={styles.urlInput}
                placeholder="https://ejemplo.com/imagen.jpg"
                value={inputUrlImagen}
                onChange={(e) => {
                  setInputUrlImagen(e.target.value);
                  if (errorImagenes) setErrorImagenes("");
                }}
                onKeyDown={handleKeyDownUrl}
              />
              <button
                type="button"
                className={styles.btnAgregarUrl}
                onClick={agregarUrlImagen}
              >
                + Agregar
              </button>
            </div>
          )}
        </div>

        {imagenesUrls.length > 0 && (
          <div className={styles.previewsGrid}>
            {imagenesUrls.map((url, index) => {
              const esInvalida = Boolean(urlsRotas[url]);
              return (
                <div key={`${url}-${index}`} className={styles.previewItem}>
                  <img
                    src={esInvalida ? errorImageIcon : url}
                    alt={
                      esInvalida
                        ? "Imagen no válida"
                        : `Vista previa ${index + 1}`
                    }
                    className={styles.previewImg}
                    onError={() => {
                      if (!esInvalida) {
                        handleImageError(url, index);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className={styles.btnQuitarImg}
                    onClick={() => eliminarImagen(index)}
                    aria-label="Eliminar imagen"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {errorImagenes && (
        <span className={styles.leyendaError}>{errorImagenes}</span>
      )}
    </div>
  );
};

export default PostImages;