import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Post } from "../../types/PerfilTypes";
import { API_URL, obtenerUrlImagen } from "../../config/api";
import styles from "./Explore.module.css";

export default function Explore() {
  const [publicaciones, setPublicaciones] = useState<Post[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

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

  if (cargando) return <p>Cargando publicaciones...</p>;

  return (
    <main className={styles.explore}>
      <header className={styles.encabezado}>
        <h1>Explorar</h1>
        <p>Descubrí lo que está compartiendo la comunidad.</p>
      </header>

      <input className={styles.busqueda} type="text" placeholder="Buscar publicaciones, usuarios o etiquetas..."
      value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />

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
                  {post.tagIds?.map((tag) => ( <small key={tag._id}>#{tag.nombre}</small> ))}
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