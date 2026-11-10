import { Link } from "react-router-dom";
import type { PostProfile } from "../types/PerfilTypes";

interface PostProfileProps { publicacion: PostProfile; }

function Posteo({ publicacion }: PostProfileProps) {
  return (
    <article className="tarjetaPublicacion"> // tarjeta del posteo
      <p className="descripcionPublicacion"> {publicacion.description} </p>

      <small>
        Publicado el{" "} // fecha
        {new Date(publicacion.createdAt).toLocaleDateString("es-AR")}
      </small>

      {publicacion.imagenes.length > 0 && ( // esot es para las imagenes
        <div className="imagenesPublicacion">
          {publicacion.imagenes.map((imagen) => (
            <img key={imagen.id} src={imagen.url} alt="Imagen de la publicación"/>
          ))}
        </div>
      )}

      {publicacion.Tags && publicacion.Tags.length > 0 && ( // los tags
        <div className="etiquetasPublicacion">
          {publicacion.Tags.map((etiqueta) => ( <span key={etiqueta.id}> #{etiqueta.name} </span> ))}
        </div>
      )}

      <div className="piePublicacion"> // el pie del posteo PROVISORIOO !!
        <span> {publicacion.cantidadComentarios} comentarios </span>
        <Link to={`/post/${publicacion.id}`}> Ver más </Link>
      </div>
    </article>
  );
}

export default Posteo;