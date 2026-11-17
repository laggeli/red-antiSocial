import { useRef } from "react";
import type { SubmitEvent } from "react";
import styles from "./Posts.module.css";
import { PostImages } from "./PostImages";
import { PostTags } from "./PostTags";
import type { TagItem } from "./PostTags";
import { Button } from "../../components/botonGenerico/Button";

interface PostFormProps {
  descripcion: string;
  setDescripcion: (value: string) => void;
  imagenesUrls: string[];
  setImagenesUrls: (urls: string[]) => void;
  urlsInvalidas: string[];
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
  urlsInvalidas,
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
  const descripcionRef = useRef<HTMLTextAreaElement | null>(null);

  return (
    <section className={styles.card}>
      <h1 className={styles.titulo}>Crear nueva publicación</h1>
      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.campoGrupo}>
          <label htmlFor="descripcion" className={styles.label}>
            Descripción
          </label>
          <textarea
            ref={descripcionRef}
            id="descripcion"
            className={`${styles.textarea} ${
              errorDescripcion ? styles.textareaError : ""
            }`}
            placeholder={`¿Qué te gustaría compartir hoy, @${userNickName || ""}?`}
            value={descripcion}
            onChange={(e) => {
              setDescripcion(e.target.value);
              setErrorDescripcion("");
            }}
            rows={4}
          />
          {errorDescripcion && (
            <span className={styles.leyendaError}>{errorDescripcion}</span>
          )}
        </div>

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

        <div className={styles.acciones}>
          <Button
            type="button"
            variant="cancelar"
            onClick={onCancel}
            disabled={enviando}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primario" disabled={enviando}>
            {enviando ? "Publicando..." : "Publicar"}
          </Button>
        </div>
      </form>
    </section>
  );
};