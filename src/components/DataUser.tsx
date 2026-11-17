import type { User } from "../types/PerfilTypes";
import { obtenerUrlImagen } from "../config/api";

interface DataUserProps {
  usuario: User;
  cantidadPublicaciones: number;
}

// info del usuario, como el nombre, el email, la cantidad de posteos
function DataUser({ usuario, cantidadPublicaciones }: DataUserProps) {
  const inicial = usuario.nickName?.charAt(0).toUpperCase() || "U";
  return (
    <section className="datosUsuario">
      {usuario.fotoPerfil ? (
        <img className="avatarPerfil" src={obtenerUrlImagen(usuario.fotoPerfil)} alt="Foto de perfil" />
      ) : (
        <div className="avatarPerfil">{inicial}</div>
      )}
      <div className="informacionUsuario">
        <h2>@{usuario.nickName}</h2>
        {usuario.nombre && <p>{usuario.nombre}</p>}
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