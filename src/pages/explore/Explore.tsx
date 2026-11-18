import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { Post } from "../../types/PerfilTypes";
import { API_URL, obtenerUrlImagen } from "../../config/api";
import styles from "./Explore.module.css";

export default function Explore() {
  const [publicaciones, setPublicaciones] = useState<Post[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [cargando, setCargando] = useState(true);

  // Obtenemos el valor del parámetro 'tag' de la URL (ej: ?tag=React)
  const tagUrl = searchParams.get("tag") || "";
  const [busqueda, setBusqueda] = useState(tagUrl);

  // Sincronizar el estado del buscador si cambia el parámetro de la URL
  useEffect(() => {
    setBusqueda(tagUrl);
  }, [tagUrl]);

  useEffect(() => {
    const cargarPublicaciones = async () => {
      try {
        const respuesta = await fetch(`${API_URL}/posts`);
        if (!respuesta.ok) { throw new Error("No se pudieron cargar las publicaciones."); }

        const datos: Post[] = await respuesta.json();
        setPublicaciones(datos);
      } 
      catch (error) { console.error(error); } 
      finally { setCargando(false); }
    };

    cargarPublicaciones();
  }, []);

  const publicacionesFiltradas = publicaciones.filter((post) => {
    const autor = typeof post.userId === "object" ? post.userId.nickName : "";
    const etiquetas = post.tagIds?.map((tag) => tag.nombre).join(" ") || "";
    const contenido = `${post.descripcion} ${autor} ${etiquetas}`;

    return contenido.toLowerCase().includes(busqueda.toLowerCase());
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setBusqueda(valor);
    if (valor) {
      setSearchParams({ tag: valor });
    } else {
      setSearchParams({});
    }
  };

  if (cargando) return <p>Cargando publicaciones...</p>;

  return (
    <main className={styles.explore}>
      <header className={styles.encabezado}>
        <h1>Explorar</h1>
        <p>Descubrí lo que está compartiendo la comunidad.</p>
      </header>

      <input 
        className={styles.busqueda} 
        type="text" 
        placeholder="Buscar publicaciones, usuarios o etiquetas..."
        value={busqueda} 
        onChange={handleInputChange} 
      />

      <section className={styles.grilla}>
        {publicacionesFiltradas.length === 0 ? (
          <p>No encontramos publicaciones.</p>
        ) : (
          publicacionesFiltradas.map((post) => (
            <article key={post._id} className={styles.tarjeta}>
              {post.imagenes?.[0] && (
                <img className={styles.imagen} src={obtenerUrlImagen(post.imagenes[0].url)} alt="Imagen de la publicación" />
              )}

              <div className={styles.contenido}>
                <p>{post.descripcion}</p>

                <Link to={`/profile/${encodeURIComponent(
                  typeof post.userId === "object"
                  ? post.userId.nickName
                  : "usuario" )}`}
                >
                  @{typeof post.userId === "object" ? post.userId.nickName : "usuario"}
                </Link>

                <div className={styles.etiquetas}>
                  {post.tagIds?.map((tag) => ( 
                    <Link key={tag._id} to={`/explore?tag=${encodeURIComponent(tag.nombre)}`}>
                      <small>#{tag.nombre}</small>
                    </Link>
                  ))}
                </div>

                <Link to={`/post/${post._id}`}> Ver publicación </Link>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}