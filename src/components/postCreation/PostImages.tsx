
import { useState, useRef, useEffect } from "react";
import type { KeyboardEvent, ChangeEvent } from "react";
import { Button } from "../../components/botonGenerico/Button";
import styles from "./Posts.module.css";
import cameraIcon from "../../img/camara.png";
import errorImageIcon from "../../img/image-notFound.jpg";
import type { PostImagesProps } from "../../types/PostTypes";

const MAX_IMAGENES = 5;
const MAX_TAMANO = 5 * 1024 * 1024; // 5 MB

export const PostImages = ({
  imagenesUrls,
  onChangeImagenes,
  archivos,
  onChangeArchivos,
  onUrlsInvalidasChange,
}: PostImagesProps) => {
  const urlInputRef = useRef<HTMLInputElement | null>(null);
  const archivoInputRef = useRef<HTMLInputElement | null>(null);

  const [inputUrlImagen, setInputUrlImagen] = useState("");
  const [errorImagenes, setErrorImagenes] = useState("");
  const [urlsRotas, setUrlsRotas] = useState<Record<string, boolean>>({});
  const [previews, setPreviews] = useState<string[]>([]);

  const cantidadImagenes = imagenesUrls.length + archivos.length;
  const disponibles = MAX_IMAGENES - cantidadImagenes;

  useEffect(() => {
    const urls = archivos.map((archivo) => URL.createObjectURL(archivo));
    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [archivos]);

  const agregarUrlImagen = () => {
    const limpia = inputUrlImagen.trim();

    if (!limpia) return;

    if (cantidadImagenes >= MAX_IMAGENES) {
      setErrorImagenes("Solo puedes agregar un máximo de 5 imágenes.");
      return;
    }

    if (imagenesUrls.includes(limpia)) {
      setErrorImagenes("Esa imagen ya fue agregada.");
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

  const handleSeleccionArchivos = (e: ChangeEvent<HTMLInputElement>) => {
    const seleccionados = Array.from(e.target.files || []);

    if (seleccionados.length === 0) return;

    const validos = seleccionados.filter((archivo) => {
      if (!archivo.type.startsWith("image/")) {
        setErrorImagenes("El archivo seleccionado no es una imagen.");
        return false;
      }

      if (archivo.size > MAX_TAMANO) {
        setErrorImagenes("Cada imagen puede pesar como máximo 5 MB.");
        return false;
      }

      return true;
    });

    const nuevos = validos.slice(0, disponibles);

    if (nuevos.length < validos.length) {
      setErrorImagenes("Solo puedes agregar un máximo de 5 imágenes.");
    } else if (nuevos.length > 0) {
      setErrorImagenes("");
    }

    onChangeArchivos([...archivos, ...nuevos]);

    // Permite volver a seleccionar el mismo archivo si se elimina.
    e.target.value = "";
  };

  const eliminarUrl = (index: number) => {
    const urlEliminada = imagenesUrls[index];

    onChangeImagenes(imagenesUrls.filter((_, i) => i !== index));

    setUrlsRotas((prev) => {
      const copia = { ...prev };
      delete copia[urlEliminada];
      return copia;
    });

    setErrorImagenes("");
  };

  const eliminarArchivo = (index: number) => {
    onChangeArchivos(archivos.filter((_, i) => i !== index));
    setErrorImagenes("");
  };

  const handleImageError = (url: string) => {
    setUrlsRotas((prev) => {
      const actualizado = { ...prev, [url]: true };

      onUrlsInvalidasChange?.(
        Object.keys(actualizado).filter((item) => actualizado[item])
      );

      return actualizado;
    });

    setErrorImagenes(
      "La imagen no pudo cargarse. Verificá que sea un enlace directo a una imagen."
    );
  };

  return (
    <div className={styles.campoGrupo}>
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

          <div className={styles.urlInputRow}>
            <input
              ref={urlInputRef}
              type="text"
              className={styles.urlInput}
              placeholder="Pegá una URL de imagen..."
              value={inputUrlImagen}
              onChange={(e) => setInputUrlImagen(e.target.value)}
              onKeyDown={handleKeyDownUrl}
            />

            <Button
              variant="secundario"
              onClick={agregarUrlImagen}
              disabled={disponibles <= 0}
            >
              + Agregar URL
            </Button>
          </div>

          <input
            ref={archivoInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleSeleccionArchivos}
          />

          <button
            type="button"
            className={styles.btnSeleccionarArchivo}
            onClick={() => archivoInputRef.current?.click()}
            disabled={disponibles <= 0}
          >
            <span>📁</span> Seleccionar desde la computadora
          </button>

          <small className={styles.textoAyudaImagenes}>
            JPG, PNG, WEBP o GIF. Máximo 5 MB por imagen.
          </small>
        </div>

        {(imagenesUrls.length > 0 || archivos.length > 0) && (
          <div className={styles.previewsGrid}>
            {imagenesUrls.map((url, index) => (
              <div key={`${url}-${index}`} className={styles.previewItem}>
                <img
                  src={urlsRotas[url] ? errorImageIcon : url}
                  alt="Vista previa"
                  className={styles.previewImg}
                  onError={() => handleImageError(url)}
                />

                <button
                  type="button"
                  className={styles.btnQuitarImg}
                  onClick={() => eliminarUrl(index)}
                  aria-label="Eliminar imagen"
                >
                  ×
                </button>
              </div>
            ))}

            {archivos.map((archivo, index) => (
              <div key={`${archivo.name}-${index}`} className={styles.previewItem}>
                <img
                  src={previews[index]}
                  alt={archivo.name}
                  className={styles.previewImg}
                />

                <button
                  type="button"
                  className={styles.btnQuitarImg}
                  onClick={() => eliminarArchivo(index)}
                  aria-label="Eliminar imagen"
                >
                  ×
                </button>
              </div>
            ))}
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