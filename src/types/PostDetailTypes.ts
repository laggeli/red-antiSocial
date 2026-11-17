import type { User, Tag, Image, Comment } from "./PerfilTypes";

export type PostImage = Image;

export interface PostDetailModel {
  _id: string;
  descripcion: string;
  publicadoEn: string;
  userId: User | string;
  tagIds?: Tag[];
  imagenes?: Image[];
  comentarios?: Comment[];
}

export interface CreateCommentPayload {
  contenido: string;
  postId: string;
  userId: string;
}