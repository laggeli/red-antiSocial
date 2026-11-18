import type { User } from "../types/PerfilTypes";
import { obtenerUrlImagen } from "../config/api";

interface DataUserProps {
  usuario: User;
  cantidadPublicaciones: number;
  cantidadSeguidores: number;
  cantidadSeguidos: number;
  esMiPerfil: boolean;
  siguiendo: boolean;
  teSigue: boolean;
  cargandoSeguimiento: boolean;
  onEditar: () => void;
  onToggleSeguir: () => void;
}

function DataUser({
  usuario,
  cantidadPublicaciones,
  cantidadSeguidores,
  cantidadSeguidos,
  esMiPerfil,
  siguiendo,
  teSigue,
  cargandoSeguimiento,
  onEditar,
  onToggleSeguir,
}: DataUserProps) {
  const inicial = usuario.nickName?.charAt(0).toUpperCase() || "U";

  return (
    <section className="datosUsuario">
      {usuario.fotoPerfil ? (
        <img
          className="avatarPerfil"
          src={obtenerUrlImagen(usuario.fotoPerfil)}
          alt={`Foto de perfil de ${usuario.nickName}`}
        />
      ) : (
        <div className="avatarPerfil">{inicial}</div>
      )}

      <div className="informacionUsuario">
        <h2>{usuario.nombre || usuario.nickName}</h2>
        <p className="nicknamePerfil">@{usuario.nickName}</p>

        {esMiPerfil ? (
          <button
            type="button"
            className="botonEditarPerfil"
            onClick={onEditar}
          >
            ✎ Editar perfil
          </button>
        ) : (
          <button
            type="button"
            className={`botonSeguir ${siguiendo ? "siguiendo" : ""}`}
            onClick={onToggleSeguir}
            disabled={cargandoSeguimiento}
          >
            {cargandoSeguimiento
              ? "Cargando..."
              : siguiendo
                ? "Dejar de seguir"
                : "Seguir"}
          </button>
        )}
      </div>

      <div className="resumenPerfil">
        <div>
          <strong>{cantidadPublicaciones}</strong>
          <span>
            {cantidadPublicaciones === 1 ? "Publicación" : "Publicaciones"}
          </span>
        </div>

        <div className="datoSeguidores">
          <strong>{cantidadSeguidores}</strong>
          <span>
            {cantidadSeguidores === 1 ? "Seguidor" : "Seguidores"}
          </span>

          {!esMiPerfil && teSigue && (
            <span className="etiquetaTeSigue">Te sigue</span>
          )}
        </div>

        <div>
          <strong>{cantidadSeguidos}</strong>
          <span>
            {cantidadSeguidos === 1 ? "Seguido" : "Seguidos"}
          </span>
        </div>
      </div>
    </section>
  );
}

export default DataUser;