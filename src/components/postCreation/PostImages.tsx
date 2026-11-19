
import { useState, useRef, useEffect } from "react";
import type { KeyboardEvent, ChangeEvent } from "react";
import styles from "./Posts.module.css";
import type { PostImagesProps } from "../../types/PostTypes";
import { PostImageDropzone } from "./PostImageDropzone";

const MAX_TAMANO = 5 * 1024 * 1024; // 5 MB

export const PostImages = ({
  imagenesUrls,
  onChangeImagenes,
  archivos,
  onChangeArchivos,
  onUrlsInvalidasChange,
  maxImagenes = 5,
}: PostImagesProps) => {
  const urlInputRef = useRef<HTMLInputElement | null>(null);
  const archivoInputRef = useRef<HTMLInputElement | null>(null);

  const [inputUrlImagen, setInputUrlImagen] = useState("");
  const [errorImagenes, setErrorImagenes] = useState("");
  const [urlsRotas, setUrlsRotas] = useState<Record<string, boolean>>({});
  const [previews, setPreviews] = useState<string[]>([]);

  const cantidadImagenes = imagenesUrls.length + archivos.length;
  const disponibles = Math.max(0, maxImagenes - cantidadImagenes);

  useEffect(() => {
    const urls = archivos.map((archivo) => URL.createObjectURL(archivo));
    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [archivos]);

  const agregarUrlImagen = () => {
    const limpia = inputUrlImagen.trim();

    if (!limpia) {
      setErrorImagenes("Por favor, pegá la URL de una imagen antes de hacer clic en agregar.");
      urlInputRef.current?.focus();
      return;
    }

    if (cantidadImagenes >= maxImagenes) {
      setErrorImagenes(
        maxImagenes === 0
          ? "Ya alcanzaste el límite máximo de 5 imágenes en esta publicación."
          : `Solo puedes agregar un máximo de ${maxImagenes} ${maxImagenes === 1 ? "imagen" : "imágenes"}.`
      );
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
      setErrorImagenes(`Solo puedes agregar un máximo de ${maxImagenes} imágenes.`);
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
      
      <PostImageDropzone
        inputUrlImagen={inputUrlImagen}
        onInputUrlChange={(val) => {
          setInputUrlImagen(val);
          setErrorImagenes("");
        }}
        onKeyDownUrl={handleKeyDownUrl}
        onAgregarUrl={agregarUrlImagen}
        onSeleccionArchivos={handleSeleccionArchivos}
        disponibles={disponibles}
        maxImagenes={maxImagenes}
        urlInputRef={urlInputRef}
        archivoInputRef={archivoInputRef}
        imagenesUrls={imagenesUrls}
        archivos={archivos}
        previews={previews}
        urlsRotas={urlsRotas}
        onImageError={handleImageError}
        onEliminarUrl={eliminarUrl}
        onEliminarArchivo={eliminarArchivo}
      />
      {errorImagenes && (
        <span className={styles.leyendaError}>{errorImagenes}</span>
      )}
    </div>
  );
};

export default PostImages;