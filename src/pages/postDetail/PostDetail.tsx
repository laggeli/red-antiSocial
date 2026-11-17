import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { PostDetailModel } from "../../types/PostDetailTypes";
import type { Comment } from "../../types/PerfilTypes";
import { CommentForm } from "../../components/postDetails/CommentForm";
import { ImageModal } from "../../components/postDetails/ImageModal";
import styles from "./PostDetail.module.css";
import { API_URL, obtenerUrlImagen } from "../../config/api";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<PostDetailModel | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const cargarDetalle = async () => {
      try {
        setLoading(true);
        setError("");
        const [resPost, resComments] = await Promise.all([
          fetch(`${API_URL}/posts/${id}`),
          fetch(`${API_URL}/posts/${id}/comments`),
        ]);
        if (!resPost.ok) throw new Error("No se pudo cargar la publicación.");
        const datosPost: PostDetailModel = await resPost.json();
        setPost(datosPost);
        if (resComments.ok) {
          const datosComentarios = await resComments.json();
          setComments(Array.isArray(datosComentarios) ? datosComentarios : []);
        } else {
          setComments([]);
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Error al cargar el detalle de la publicación.");
      } finally {
        setLoading(false);
      }
    };
    cargarDetalle();
  }, [id]);

  const handleEnviarComentario = async (texto: string) => {
    if (!id || !user?._id) throw new Error("No se pudo identificar al usuario. Volvé a iniciar sesión.");
    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contenido: texto, userId: user._id, postId: id }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || data.message || "No se pudo guardar el comentario.");
      const nuevo = data.comment as Comment;
      setComments((prev) => [{ ...nuevo, userId: user }, ...prev]);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className={styles.mensajePerfil}>Cargando publicación...</p>;
  if (error || !post) return <main className={styles.detailContainer}><p className={styles.mensajePerfil}>{error || "Publicación no encontrada."}</p><Link to="/" className={styles.btnVolver}>Volver al inicio</Link></main>;

  const autor = typeof post.userId === "object" ? post.userId : null;
  const nickName = autor?.nickName || "usuario";
  const inicial = nickName.replace(/^@/, "").charAt(0).toUpperCase();
  const imagenes = post.imagenes || [];
  const etiquetas = post.tagIds || [];

  return (
    <main className={styles.detailContainer}>
      <Link to="/" className={styles.btnVolver}>← Volver al feed</Link>
      <article className={styles.tarjetaDetalle}>
        <div className={styles.cabeceraPost}>
          <div className={styles.avatar}>{inicial}</div>
          <div className={styles.infoUsuario}><span className={styles.nickName}>@{nickName.replace(/^@/, "")}</span>{autor?.nombre && <span>{autor.nombre}</span>}</div>
        </div>
        <p className={styles.descripcionCompleta}>{post.descripcion}</p>
        {imagenes.length > 0 && <div className={styles.imagenesDetalle}>{imagenes.map((img, index) => {
          const url = obtenerUrlImagen(img.url);
          return <img key={img._id || `${img.url}-${index}`} src={url} alt="Imagen adjunta" onClick={() => setImagenSeleccionada(url)} style={{ cursor: "pointer" }} />;
        })}</div>}
        {etiquetas.length > 0 && <div className={styles.etiquetasPublicacion}>{etiquetas.map((tag) => <span key={tag._id}>#{tag.nombre}</span>)}</div>}
      </article>
      <section className={styles.seccionComentarios}>
        <h3>Comentarios ({comments.length})</h3>
        <div className={styles.listaComentarios}>
          {comments.length === 0 ? <p className={styles.sinComentarios}>Aún no hay comentarios. ¡Sé el primero!</p> : comments.map((com) => {
            const autorComentario = typeof com.userId === "object" ? com.userId.nickName : "usuario";
            return <div key={com._id} className={styles.itemComentario}><span className={styles.autorComentario}>@{autorComentario}</span><p className={styles.textoComentario}>{com.contenido}</p></div>;
          })}
        </div>
        <CommentForm onEnviarComentario={handleEnviarComentario} submitting={submitting} />
      </section>
      <ImageModal imagenUrl={imagenSeleccionada} onCerrar={() => setImagenSeleccionada(null)} />
    </main>
  );
}
