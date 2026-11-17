import { useRef } from "react";
import type { SubmitEvent } from "react";
import styles from "./Posts.module.css";
import { PostDescription } from "./PostDescription";
import { PostImages } from "./PostImages";
import { PostTags } from "./PostTags";
import { PostFormButtons } from "./PostFormButtons";
import type { TagItem } from "./PostTags";
import { Button } from "../../components/botonGenerico/Button";

interface PostFormProps {
  descripcion: string;
  setDescripcion: (value: string) => void;
  imagenesUrls: string[];
  setImagenesUrls: (urls: string[]) => void;
  setUrlsInvalidas: (urls: string[]) => void;
  tagsSeleccionados: TagItem[];
  setTagsSeleccionados: (tags: TagItem[]) => void;
  archivos: File[];
  setArchivos: (archivos: File[]) => void;
  errorDescripcion: string;
  setErrorDescripcion: (error: string) => void;
  error: string;
  enviando: boolean;
  userNickName?: string;
  onSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

export const PostForm = ({
  descripcion,
  setDescripcion,
  imagenesUrls,
  setImagenesUrls,
  setUrlsInvalidas,
  tagsSeleccionados,
  setTagsSeleccionados,
  archivos,
  setArchivos,
  errorDescripcion,
  setErrorDescripcion,
  error,
  enviando,
  userNickName,
  onSubmit,
  onCancel,
}: PostFormProps) => {
    //Se crea la referencia para poder hacer el .focus() desde el contenedor padre o manejarlo
  const descripcionRef = useRef<HTMLTextAreaElement | null>(null);

  // En el submit se verifica que haga el focus si la descripción está vacía
  const handleFormSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    if (!descripcion.trim()) {
      descripcionRef.current?.focus();
    }
    onSubmit(e);
  };

  return (
    <section className={styles.card}>
      <h1 className={styles.titulo}>Crear nueva publicación</h1>
      <form onSubmit={handleFormSubmit} className={styles.form}>
        <PostDescription
          descripcion={descripcion}
          setDescripcion={setDescripcion}
          errorDescripcion={errorDescripcion}
          setErrorDescripcion={setErrorDescripcion}
          userNickName={userNickName}
          descripcionRef={descripcionRef}
        />

        <PostImages
          imagenesUrls={imagenesUrls}
          onChangeImagenes={setImagenesUrls}
          archivos={archivos}
          onChangeArchivos={setArchivos}
          onUrlsInvalidasChange={setUrlsInvalidas}
        />

        <PostTags
          tagsSeleccionados={tagsSeleccionados}
          onChangeTags={setTagsSeleccionados}
        />

        {error && <p className={styles.mensajeError}>{error}</p>}

        <PostFormButtons enviando={enviando} onCancel={onCancel} />
      </form>
    </section>
  );
};