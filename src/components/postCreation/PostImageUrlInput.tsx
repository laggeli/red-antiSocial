import type { ChangeEvent } from "react";
import { AddImageUrlButton } from "./AddImageUrlButton";
import styles from "./Posts.module.css";
import type { PostImageUrlInputProps } from "../../types/PostTypes";

export const PostImageUrlInput = ({
  inputUrlImagen,
  onInputUrlChange,
  onKeyDownUrl,
  onAgregarUrl,
  disponibles,
  urlInputRef,
}: PostImageUrlInputProps) => {
  return (
    <div className={styles.urlInputRow}>
      <input
        ref={urlInputRef}
        type="text"
        className={styles.urlInput}
        placeholder="Pegá una URL de imagen..."
        value={inputUrlImagen}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onInputUrlChange(e.target.value)}
        onKeyDown={onKeyDownUrl}
      />

      <AddImageUrlButton onClick={onAgregarUrl} disabled={disponibles <= 0} />
    </div>
  );
};

export default PostImageUrlInput;