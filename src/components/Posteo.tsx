import { Link } from "react-router-dom";
import { Eye } from "react-bootstrap-icons";
import ButtonIcon from "./botonGenerico/ButtonIcon";
import type { PostProfile } from "../types/PerfilTypes";
import { obtenerUrlImagen } from "../config/api";

interface PostProfileProps {
  publicacion: PostProfile;
}

function Posteo({ publicacion }: PostProfileProps) {
  const imagenes = publicacion.imagenes || [];
  const etiquetas = publicacion.tagIds || [];
  const cantidadComentarios = publicacion.cantidadComentarios;

  return (
    <article className="tarjetaPublicacion">
      <p className="descripcionPublicacion">
        {publicacion.descripcion}
      </p>

      <small>
        Publicado el{" "}
        {new Date(publicacion.publicadoEn).toLocaleDateString("es-AR")}
      </small>

      {imagenes.length > 0 && (
        <div className="imagenesPublicacion">
          {imagenes.map((imagen, index) => (
            <img
              key={imagen._id || `${imagen.url}-${index}`}
              src={obtenerUrlImagen(imagen.url)}
              alt="Imagen de la publicación"
            />
          ))}
        </div>
      )}

      {etiquetas.length > 0 && (
        <div className="etiquetasPublicacion">
          {etiquetas.map((tag) => (
            <Link
              key={tag._id}
              to={`/explore?tag=${encodeURIComponent(tag.nombre)}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <span>#{tag.nombre}</span>
            </Link>
          ))}
        </div>
      )}

      <div className="piePublicacion">
        <span className="contadorComentarios">
          💬 {cantidadComentarios}{" "}
          {cantidadComentarios === 1 ? "comentario" : "comentarios"}
        </span>

        <ButtonIcon
          variant="primario"
          icon={<Eye size={16} />}
          to={`/post/${publicacion._id}`}
          state={{ from: "/profile" }}
        >
          Ver más
        </ButtonIcon>

      </div>
    </article>
  );
}

export default Posteo;