import { Link } from "react-router-dom";
import type { Post }  from "../types/PerfilTypes";

interface PostProfileProps {
    publicacion: Post;
}

function PostProfile({ publicacion }: PostProfileProps) {
  return (
    <article className="tarjetaPublicacion">
      <p className="descripcionPublicacion"> {publicacion.descripcion} </p>
      <small>
        Publicado el{" "} {new Date(publicacion.publicadoEn).toLocaleDateString("es-AR")}
      </small>

      {publicacion.imagenes && publicacion.imagenes.length > 0 && (
        <div className="imagenesPublicacion">
          {publicacion.imagenes.map((imagen, index) => (
            <img key={imagen._id || index}
              src={`http://localhost:3000${imagen.url}`}
              alt="Imagen de la publicación"
            />
          ))}
        </div>
      )}

      {publicacion.tagIds && publicacion.tagIds.length > 0 && (
        <div className="etiquetasPublicacion">
          {publicacion.tagIds.map((etiqueta) => (
            <span key={etiqueta._id}> #{etiqueta.nombre} </span>
          ))}
        </div>
      )}

      <div className="piePublicacion"> <Link to={`/post/${publicacion._id}`}> Ver más </Link> </div>
    </article>
  );
}

export default PostProfile;