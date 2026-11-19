import { useState, useEffect } from "react";
import { Eye } from "react-bootstrap-icons";
import { ButtonIcon } from "../../components/botonGenerico/ButtonIcon";
import { Link } from "react-router-dom";
import type { PostDetailModel } from "../../types/PostDetailTypes";
import { BannerWelcome } from "../../components/pageBanner/BannerWelcome";
import styles from "./Home.module.css";
import { API_URL, obtenerUrlImagen } from "../../config/api";

interface PostFeed extends PostDetailModel {
  commentsCount: number;
}

export default function Home() {
  const [posts, setPosts] = useState<PostFeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarPosts = async () => {
      try {
        setLoading(true);
        setError("");

        const respuesta = await fetch(`${API_URL}/posts`);

        if (!respuesta.ok) {
          throw new Error("No se pudieron obtener las publicaciones.");
        }

        const datos: PostDetailModel[] = await respuesta.json();

        const postsConComentarios = await Promise.all(
          (Array.isArray(datos) ? datos : []).map(async (post) => {
            let commentsCount = 0;

            try {
              const resComentarios = await fetch(
                `${API_URL}/posts/${post._id}/comments`
              );

              if (resComentarios.ok) {
                const comentarios = await resComentarios.json();
                commentsCount = Array.isArray(comentarios)
                  ? comentarios.length
                  : 0;
              }
            } catch (err) {
              console.error("No se pudieron cargar los comentarios", err);
            }

            return { ...post, commentsCount };
          })
        );

        setPosts(postsConComentarios);
      } catch (err) {
        console.error(err);
        setError("Ocurrió un error al cargar las publicaciones.");
      } finally {
        setLoading(false);
      }
    };

    cargarPosts();
  }, []);

  if (loading) {
    return <p className={styles.mensajePerfil}>Cargando publicaciones...</p>;
  }

  if (error) {
    return <p className={styles.mensajePerfil}>{error}</p>;
  }

  return (
    <main className={styles.homeContainer}>
      <BannerWelcome />

      <div className={styles.seccionFeed}>
        {posts.length === 0 ? (
          <p className={styles.mensajePerfil}>
            No hay publicaciones disponibles en este momento.
          </p>
        ) : (
          posts.map((post) => {
            const autor =
              typeof post.userId === "object" ? post.userId : null;

            const nickName = autor?.nickName || "usuario";
            const inicial = nickName
              .replace(/^@/, "")
              .charAt(0)
              .toUpperCase();

            const imagenes = post.imagenes || [];
            const etiquetas = post.tagIds || [];

            return (
              <article
                key={post._id}
                className={styles.tarjetaPublicacion}
              >
                <div className={styles.cabeceraPost}>
                  <div className={styles.avatar}>
                    {autor?.fotoPerfil ? (
                      <img
                        src={obtenerUrlImagen(autor.fotoPerfil)}
                        alt={`Foto de perfil de ${nickName}`}
                      />
                    ) : (
                      inicial
                    )}
                  </div>

                  <div className={styles.infoUsuario}>
                    <Link
                      to={`/profile/${encodeURIComponent(nickName)}`}
                      className={styles.nickName}
                    >
                      @{nickName.replace(/^@/, "")}
                    </Link>

                    {autor?.nombre && <span>{autor.nombre}</span>}
                  </div>
                </div>

                <p className={styles.descripcionPublicacion}>
                  {post.descripcion}
                </p>

                {imagenes.length > 0 && (
                  <div className={styles.imagenesPublicacion}>
                    {imagenes.map((img, index) => (
                      <img
                        key={img._id || `${img.url}-${index}`}
                        src={obtenerUrlImagen(img.url)}
                        alt="Imagen adjunta"
                      />
                    ))}
                  </div>
                )}

                {etiquetas.length > 0 && (
                  <div className={styles.etiquetasPublicacion}>
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
                
                <div className={styles.piePublicacion}>
                  <Link
                    to={`/post/${post._id}#comentarios`}
                    state={{ from: "/" }}
                    className={styles.contadorComentarios}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    💬 {post.commentsCount}{" "}
                    {post.commentsCount === 1 ? "comentario" : "comentarios"}
                  </Link>

                  <Link
                    to={`/post/${post._id}`}
                    state={{ from: "/" }}
                    className={styles.btnVerMas}
                  >
                    Ver más
                  </Link>
                </div>
              </article>
            );
          })
        )}
      </div>
    </main>
  );
}