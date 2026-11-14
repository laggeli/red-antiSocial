import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { PostDetailModel, PostImage, Comment } from "../../types/PostDetailTypes";
import styles from "./Home.module.css";

const API_URL = "http://localhost:3001";

export default function Home() {
  const [posts, setPosts] = useState<PostDetailModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // hook para cargar los datos apenas se monta el componente
  useEffect(() => {
    const obtenerPostsYDetalles = async () => {
      try {
        setLoading(true);
        setError("");

        //listado general de publicaciones con GET /posts
        const respuestaPosts = await fetch(`${API_URL}/posts`);
        if (!respuestaPosts.ok) {
          throw new Error("Error al obtener las publicaciones");
        }
        const datosPosts: PostDetailModel[] = await respuestaPosts.json();

        // recorremos las publicaciones de forma secuencial para enriquecerlas con imagenes y comentarios
        const postsEnriquecidos: PostDetailModel[] = [];

        for (const post of datosPosts) {
          //imagenes del post
          let imagenes: PostImage[] = [];
          try {
            const resImg = await fetch(`${API_URL}/postimages/post/${post.id}`);
            if (resImg.ok) {
              imagenes = await resImg.json();
            }
          } catch {
            imagenes = [];
          }

          //los comentarios del post
          let comentarios: Comment[] = [];
          try {
            const resCom = await fetch(`${API_URL}/comments/post/${post.id}`);
            if (resCom.ok) {
              comentarios = await resCom.json();
            }
          } catch {
            comentarios = [];
          }

          // agregamos el post con sus datos enriquecidos al nuevo array
          postsEnriquecidos.push({
            ...post,
            images: imagenes,
            commentsCount: comentarios.length,
          });
        }

        // atualizamos el estado con el nuevo array de forma inmutable
        setPosts(postsEnriquecidos);
      } catch (err) {
        console.error(err);
        setError("Ocurrió un error al cargar las publicaciones.");
      } finally {
        // nos aseguramos de apagar el estado de carga pase lo que pase
        setLoading(false);
      }
    };

    obtenerPostsYDetalles();
  }, []);

  // validamos si esta cargando para mostrar el mensaje correspondiente
  if (loading) {
    return <p className={styles.mensajePerfil}>Cargando publicaciones...</p>;
  }

  // si hubo algun problema en el fetch lo atrapamos aca
  if (error) {
    return <p className={styles.mensajePerfil}>{error}</p>;
  }

  return (
    <main className={styles.homeContainer}>
      {/* banner institucional */}
      <div className={styles.banner}>
        <h1>UnaHur Anti-Social Net</h1>
        <p>La red académica para compartir publicaciones, debates e ideas en la comunidad universitaria.</p>
      </div>

      <div className={styles.seccionFeed}>
        {/* controlamos si el array de posts esta vacio o tiene elementos (quitamos el h2 que sobraba) */}
        {posts.length === 0 ? (
          <p className={styles.mensajePerfil}>No hay publicaciones disponibles en este momento.</p>
        ) : (
          posts.map((post) => {
            // obtenemos la inicial para el avatar a partir del nickname del usuario
            const nickName = post.user?.nickName || "usuario";
            const inicial = nickName.replace(/^@/, "").charAt(0).toUpperCase();

            return (
              <article key={post.id} className={styles.tarjetaPublicacion}>
                {/* cabecera con avatar y nombre de usuario */}
                <div className={styles.cabeceraPost}>
                  <div className={styles.avatar}>{inicial}</div>
                  <div className={styles.infoUsuario}>
                    <span className={styles.nickName}>@{nickName.replace(/^@/, "")}</span>
                  </div>
                </div>

                {/* descripcion del post */}
                <p className={styles.descripcionPublicacion}>{post.description}</p>

                {/* validamos si existen imagenes asociadas para renderizarlas */}
                {post.images && post.images.length > 0 && (
                  <div className={styles.imagenesPublicacion}>
                    {post.images.map((img) => (
                      <img key={img.id} src={img.url} alt="Imagen adjunta" />
                    ))}
                  </div>
                )}

                {/* etiquetas del post */}
                {post.tags && post.tags.length > 0 && (
                  <div className={styles.etiquetasPublicacion}>
                    {post.tags.map((tag) => (
                      <span key={tag.id}>#{tag.name}</span>
                    ))}
                  </div>
                )}

                {/* pie con comentarios y boton ver mas */}
                <div className={styles.piePublicacion}>
                  <span className={styles.contadorComentarios}>
                    💬 {post.commentsCount ?? 0} comentarios
                  </span>
                  {/* enlace para navegar al detalle usando el id del post */}
                  <Link to={`/post/${post.id}`} className={styles.btnVerMas}>
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