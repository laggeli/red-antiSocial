export interface User {
  id: number;
  nickName: string;
  email: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Image {
  id: number;
  url: string;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  UserId: number;
  PostId: number;
}

export interface Post {
  id: number;
  description: string;
  createdAt: string;
  UserId: number;
  Tags?: Tag[];
}

export interface PostProfile extends Post {
  cantidadComentarios: number;
  imagenes: Image[];
}