import type { User } from "../types/PerfilTypes";

interface DataUserProps {
  usuario: User;
  cantidadPublicaciones: number;
}

function DataUser({ usuario, cantidadPublicaciones }: DataUserProps) {
  return (
    <section className="datosUsuario">
      <div className="avatarPerfil">
        {usuario.nickName.charAt(0).toUpperCase()}
      </div>

      <div className="informacionUsuario">
        <h2>{usuario.nombre}</h2>
        <p>@{usuario.nickName}</p>
        <p>{usuario.email}</p>
      </div>

      <div className="resumenPerfil">
        <strong>{cantidadPublicaciones}</strong>
        <span>Publicaciones</span>
      </div>
    </section>
  );
}

export default DataUser;