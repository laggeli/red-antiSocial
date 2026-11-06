export interface User {
  _id: string;
  nickName: string;
  nombre: string;
  email: string;
}

export interface Image {
  _id?: string;
  url: string;
}

export interface Tag {
  _id: string;
  nombre: string;
}

export interface Post {
  _id: string;
  descripcion: string;
  publicadoEn: string;

  // el backend completa esta referencia con populate()
  userId: {
    _id: string;
    nickName: string;
    nombre: string;
  };

  imagenes: Image[];
  tagIds: Tag[];
}
