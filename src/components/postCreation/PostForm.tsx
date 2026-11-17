import { useRef } from "react";
import type { SubmitEvent } from "react";
import styles from "./Posts.module.css";
import { PostDescription } from "./PostDescription";
import { PostImages } from "./PostImages";
import { PostTags } from "./PostTags";
import { PostFormButtons } from "./PostFormButtons";
import type { PostFormProps } from "../../types/PostTypes";

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