import type { ChangeEvent } from "react";
import styles from "./Posts.module.css";
import type { PostTagInputProps } from "../../types/PostTypes";

export const PostTagInput = ({
  tagsSeleccionados,
  inputEtiqueta,
  onInputChange,
  onKeyDown,
  onToggleTag,
  hasError,
  inputRef,
}: PostTagInputProps) => {
  return (
    <div className={`${styles.tagsBox} ${hasError ? styles.tagsBoxError : ""}`}>
      {tagsSeleccionados.map((tag) => (
        <span key={tag._id} className={styles.tagChip}>
          #{tag.nombre}
          <button
            type="button"
            className={styles.tagRemove}
            onClick={() => onToggleTag(tag)}
            aria-label={`Quitar ${tag.nombre}`}
          >
            ×
          </button>
        </span>
      ))}

      <input
        ref={inputRef}
        id="etiquetas"
        type="text"
        className={styles.tagInput}
        placeholder="Escribí una etiqueta y presioná Enter..."
        value={inputEtiqueta}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onInputChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};