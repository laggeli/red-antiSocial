import type { RefObject } from "react";
import styles from "./Posts.module.css";

interface PostDescriptionProps {
  descripcion: string;
  setDescripcion: (value: string) => void;
  errorDescripcion: string;
  setErrorDescripcion: (error: string) => void;
  userNickName?: string;
  descripcionRef?: RefObject<HTMLTextAreaElement | null>; // Referencia para poder hacer foco en el textarea si hay un error de validación
}

export const PostDescription = ({
  descripcion,
  setDescripcion,
  errorDescripcion,
  setErrorDescripcion,
  userNickName,
  descripcionRef,
}: PostDescriptionProps) => {
  return (
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
  );
};

export default PostDescription;