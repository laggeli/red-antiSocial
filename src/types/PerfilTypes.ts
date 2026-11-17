export interface User {
  _id: string;
  nickName: string;
  nombre?: string;
  email?: string;
  fotoPerfil?: string;
}

export interface Tag {
  _id: string;
  nombre: string;
}

export interface Image {
  _id?: string;
  url: string;
}

export interface Comment {
  _id: string;
  contenido: string;
  comentadoEn: string;
  userId: User | string;
  postId: string;
}

export interface Post {
  _id: string;
  descripcion: string;
  publicadoEn: string;
  userId: User | string;
  tagIds?: Tag[];
  imagenes?: Image[];
  comentarios?: Comment[];
}

export interface PostProfile extends Post {
  cantidadComentarios: number;
}