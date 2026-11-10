import type { User } from "../types/PerfilTypes";

interface DataUserProps {
  usuario: User;
  cantidadPublicaciones: number;
}

// info del usuario, como el nombre, el email, la cantidad de posteos
function DataUser({ usuario, cantidadPublicaciones }: DataUserProps) {
  return (
    <section className="datosUsuario">
      <div className="avatarPerfil"> {usuario.nickName.charAt(0).toUpperCase()} </div>

      <div className="informacionUsuario">
        <h2>@{usuario.nickName}</h2>
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