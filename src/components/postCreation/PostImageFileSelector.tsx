import type { ChangeEvent, RefObject } from "react";
import { AddSelectImageButton } from "./AddSelectImageButton";

interface PostImageFileSelectorProps {
  archivoInputRef: RefObject<HTMLInputElement | null>;
  onSeleccionArchivos: (e: ChangeEvent<HTMLInputElement>) => void;
  disponibles: number;
}

export const PostImageFileSelector = ({
  archivoInputRef,
  onSeleccionArchivos,
  disponibles,
}: PostImageFileSelectorProps) => {
  return (
    <>
      <input
        ref={archivoInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={onSeleccionArchivos}
      />

      <AddSelectImageButton
        onClick={() => archivoInputRef.current?.click()}
        disabled={disponibles <= 0}
      />
    </>
  );
};

export default PostImageFileSelector;