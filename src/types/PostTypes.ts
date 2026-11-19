import type { SubmitEvent, KeyboardEvent, ChangeEvent, RefObject } from "react";

// Estructura de una etiqueta (Tag)
export interface TagItem {
  _id: string;
  nombre: string;
}

// Props que recibe el componente estructural del formulario
export interface PostFormProps {
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

export interface PostImagesProps {
  imagenesUrls: string[];
  onChangeImagenes: (nuevasUrls: string[]) => void;
  archivos: File[];
  onChangeArchivos: (nuevosArchivos: File[]) => void;
  onUrlsInvalidasChange?: (urlsInvalidas: string[]) => void;
  maxImagenes?: number;
}

export interface PostImageDropzoneProps {
  inputUrlImagen: string;
  onInputUrlChange: (value: string) => void;
  onKeyDownUrl: (e: KeyboardEvent<HTMLInputElement>) => void;
  onAgregarUrl: () => void;
  onSeleccionArchivos: (e: ChangeEvent<HTMLInputElement>) => void;
  disponibles: number;
  maxImagenes?: number;
  urlInputRef: RefObject<HTMLInputElement | null>;
  archivoInputRef: RefObject<HTMLInputElement | null>;
  imagenesUrls: string[];
  archivos: File[];
  previews: string[];
  urlsRotas: Record<string, boolean>;
  onImageError: (url: string) => void;
  onEliminarUrl: (index: number) => void;
  onEliminarArchivo: (index: number) => void;
}

export interface PostImageUrlInputProps {
  inputUrlImagen: string;
  onInputUrlChange: (value: string) => void;
  onKeyDownUrl: (e: KeyboardEvent<HTMLInputElement>) => void;
  onAgregarUrl: () => void;
  disponibles: number;
  urlInputRef: RefObject<HTMLInputElement | null>;
}

export interface PostImageFileSelectorProps {
  archivoInputRef: RefObject<HTMLInputElement | null>;
  onSeleccionArchivos: (e: ChangeEvent<HTMLInputElement>) => void;
  disponibles: number;
}

export interface PostImagePreviewsListProps {
  imagenesUrls: string[];
  archivos: File[];
  previews: string[];
  urlsRotas: Record<string, boolean>;
  onImageError: (url: string) => void;
  onEliminarUrl: (index: number) => void;
  onEliminarArchivo: (index: number) => void;
}

export interface AddImageButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export interface PostTagsProps {
  tagsSeleccionados: TagItem[];
  onChangeTags: (nuevosTags: TagItem[]) => void;
}

export interface PostTagInputProps {
  tagsSeleccionados: TagItem[];
  inputEtiqueta: string;
  onInputChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onToggleTag: (tag: TagItem) => void;
  hasError: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
}

export interface PostTagOptionsListProps {
  tagsDisponibles: TagItem[];
  tagsSeleccionados: TagItem[];
  busqueda: string;
  onToggleTag: (tag: TagItem) => void;
}

export interface CreatePostPayload {
  descripcion: string;
  userId: string;
  tagIds: string[];
  imagenesUrls: string[];
}