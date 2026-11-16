// src/pages/postDetail/PostDetail.tsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import type { PostDetailModel, PostImage, Comment } from "../../types/PostDetailTypes";
import type { User } from "../../types/PerfilTypes";
import { CommentForm } from "../../components/postDetails/CommentForm";
import { ImageModal } from "../../components/postDetails/ImageModal";
import styles from "./PostDetail.module.css";

const API_URL = "http://localhost:3001";

interface PostDetailProps {
  nickName: string; // recibimos el nickname actual para obtener el id del usuario al comentar
}

// funciones atomicas de servicio para traer la data especifica del post
async function fetchPostById(id: string): Promise<PostDetailModel> {
  const response = await fetch(`${API_URL}/posts/${id}`);
  if (!response.ok) throw new Error("No se pudo cargar la publicación.");
  return await response.json();
}

async function fetchImagesByPostId(id: string): Promise<PostImage[]> {
  try {
    const res = await fetch(`${API_URL}/postimages/post/${id}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function fetchCommentsByPostId(id: string): Promise<Comment[]> {
  try {
    const res = await fetch(`${API_URL}/comments/post/${id}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function fetchCurrentUserId(nickName: string): Promise<number> {
  const resUsers = await fetch(`${API_URL}/users`);
  if (!resUsers.ok) throw new Error("Error al verificar el usuario.");
  const usuarios: User[] = await resUsers.json();
  const usuarioActual = usuarios.find((u) => u.nickName === nickName);

  if (!usuarioActual) {
    throw new Error("Debes iniciar sesión para comentar.");
  }
  return usuarioActual.id;
}

async function sendNewComment(payload: { text: string; postId: number; userId: number }): Promise<Comment> {
  const response = await fetch(`${API_URL}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Error al guardar el comentario en el servidor.");
  }
  return await response.json();
}

export default function PostDetail({ nickName }: PostDetailProps) {
  const { id } = useParams<{ id: string }>();

  const [post, setPost] = useState<PostDetailModel | null>(null);
  const [images, setImages] = useState<PostImage[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  
  // estado para controlar la imagen seleccionada que se vera en el modal
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // hook para cargar toda la data del post al montar o cambiar el id de la url
  useEffect(() => {
    if (!id) return;

    const loadPostDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // traemos en paralelo o secuencial los datos de la publicacion, imagenes y comentarios
        const postData = await fetchPostById(id);
        const imagesData = await fetchImagesByPostId(id);
        const commentsData = await fetchCommentsByPostId(id);

        setPost(postData);
        setImages(imagesData);
        setComments(commentsData);
      } catch (err) {
        console.error(err);
        setError("Error al cargar el detalle de la publicación.");
      } finally {
        setLoading(false);
      }
    };

    loadPostDetails();
  }, [id]);

  // funcion que le pasamos al componente hijo para manejar el envio del comentario
  const handleEnviarComentario = async (texto: string) => {
    if (!id) return;

    setSubmitting(true);
    try {
      const userId = await fetchCurrentUserId(nickName);

      const createdComment = await sendNewComment({
        text: texto,
        postId: Number(id),
        userId,
      });

      // actualizacion inmutable del estado local de comentarios
      setComments((prev) => [...prev, createdComment]);
    } finally {
      setSubmitting(false);
    }
  };

  // validaciones de carga o error
  if (loading) {
    return <p className={styles.mensajePerfil}>Cargando publicación...</p>;
  }

  if (error || !post) {
    return (
      <main className={styles.detailContainer}>
        <p className={styles.mensajePerfil}>{error || "Publicación no encontrada"}</p>
        <Link to="/" className={styles.btnVolver}>
          Volver al inicio
        </Link>
      </main>
    );
  }

  // protegemos el valor de nickName para evitar errores si viene undefined (me dio problemas en la primera implementacion)
  const postNickName = post.user?.nickName || nickName || "usuario";
  const inicial = String(postNickName).replace(/^@/, "").charAt(0).toUpperCase();

  return (
    <main className={styles.detailContainer}>
      {/* boton para regresar al feed principal */}
      <Link to="/" className={styles.btnVolver}>
        ← Volver al feed
      </Link>

      {/* tarjeta principal con la info completa */}
      <article className={styles.tarjetaDetalle}>
        <div className={styles.cabeceraPost}>
          <div className={styles.avatar}>{inicial}</div>
          <div className={styles.infoUsuario}>
            <span className={styles.nickName}>@{String(postNickName).replace(/^@/, "")}</span>
          </div>
        </div>

        <p className={styles.descripcionCompleta}>{post.description}</p>

        {/* galeria de imagenes adjuntas con evento onClick para abrirlas en grande */}
        {images.length > 0 && (
          <div className={styles.imagenesDetalle}>
            {images.map((img) => (
              <img
                key={img.id}
                src={img.url}
                alt="Imagen adjunta al post"
                onClick={() => setImagenSeleccionada(img.url)}
                style={{ cursor: "pointer" }}
                title="Haz clic para ampliar"
              />
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
      </article>

      {/* seccion interactiva de comentarios */}
      <section className={styles.seccionComentarios}>
        <h3>Comentarios ({comments.length})</h3>

        <div className={styles.listaComentarios}>
          {comments.length === 0 ? (
            <p className={styles.sinComentarios}>Aún no hay comentarios. ¡Sé el primero en comentar!</p>
          ) : (
            comments.map((com) => {
              const autorComentario = com.user?.nickName || `Usuario #${com.userId}`;
              return (
                <div key={com.id} className={styles.itemComentario}>
                  <span className={styles.autorComentario}>@{String(autorComentario).replace(/^@/, "")}</span>
                  <p className={styles.textoComentario}>{com.text}</p>
                </div>
              );
            })
          )}
        </div>

        {/* renderizamos el formulario de comentarios modularizado */}
        <CommentForm onEnviarComentario={handleEnviarComentario} submitting={submitting} />
      </section>

      {/* modal modularizado para mostrar la imagen ampliada */}
      <ImageModal
        imagenUrl={imagenSeleccionada}
        onCerrar={() => setImagenSeleccionada(null)}
      />
    </main>
  );
}