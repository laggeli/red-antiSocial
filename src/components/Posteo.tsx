import { Link } from "react-router-dom";
import type { PostProfile } from "../types/PerfilTypes";
import { obtenerUrlImagen } from "../config/api";

interface PostProfileProps { publicacion: PostProfile; }

function Posteo({ publicacion }: PostProfileProps) {
  const imagenes = publicacion.imagenes || [];
  const etiquetas = publicacion.tagIds || [];
  return (
    <article className="tarjetaPublicacion">
      <p className="descripcionPublicacion">{publicacion.descripcion}</p>
      <small>Publicado el {new Date(publicacion.publicadoEn).toLocaleDateString("es-AR")}</small>
      {imagenes.length > 0 && (
        <div className="imagenesPublicacion">
          {imagenes.map((imagen, index) => (
            <img key={imagen._id || `${imagen.url}-${index}`} src={obtenerUrlImagen(imagen.url)} alt="Imagen de la publicación" />
          ))}
        </div>
      )}
      {etiquetas.length > 0 && (
        <div className="etiquetasPublicacion">
          {etiquetas.map((tag) => <span key={tag._id}>#{tag.nombre}</span>)}
        </div>
      )}
      <div className="piePublicacion">
        <span>{publicacion.cantidadComentarios} comentarios</span>
        <Link to={`/post/${publicacion._id}`} state={{ from: "/profile" }} >
          Ver más
        </Link>
      </div>
    </article>
  );
}
export default Posteo;