import type { User } from "./PerfilTypes";

export interface Tag {
  id: number;
  name: string;
}

export interface PostImage {
  id: number;
  url: string;
  postId: number;
}

export interface Comment {
  id: number;
  text: string;
  postId: number;
  userId: number;
  user?: User;
  createdAt?: string;
}

export interface PostDetailModel {
  id: number;
  description: string;
  userId: number;
  user?: User;
  tags?: Tag[];
  images?: PostImage[];
  commentsCount?: number;
}

export interface CreateCommentPayload {
  text: string;
  postId: number;
  userId: number;
}