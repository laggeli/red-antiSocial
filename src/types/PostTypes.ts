import type { SubmitEvent } from "react";

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
}

export interface CreatePostPayload {
  descripcion: string;
  userId: string;
  tagIds: string[];
  imagenesUrls: string[];
}