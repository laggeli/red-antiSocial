
import { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const navigate = useNavigate();

  const volverA =
    (location.state as { from?: string } | null)?.from || "/";

  const [post, setPost] = useState<PostDetailModel | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState("");
  const [errorEliminar, setErrorEliminar] = useState("");
  const [comentarioEditando, setComentarioEditando] = useState<string | null>(null);
  const [textoEditado, setTextoEditado] = useState("");
  const [errorComentario, setErrorComentario] = useState("");
  const [editandoPost, setEditandoPost] = useState(false);
  const [descripcionEditada, setDescripcionEditada] = useState("");
  const [nuevaImagenUrl, setNuevaImagenUrl] = useState("");
  const [guardandoPost, setGuardandoPost] = useState(false);
  const [errorEdicionPost, setErrorEdicionPost] = useState("");

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

        if (!resPost.ok) {
          throw new Error("No se pudo cargar la publicación.");
        }

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
        setError(
          err instanceof Error
            ? err.message
            : "Error al cargar el detalle de la publicación."
        );
      } finally {
        setLoading(false);
      }
    };

    cargarDetalle();
  }, [id]);

  const handleEnviarComentario = async (texto: string) => {
    if (!id || !user?._id) {
      throw new Error("No se pudo identificar al usuario. Volvé a iniciar sesión.");
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contenido: texto,
          userId: user._id,
          postId: id,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "No se pudo guardar el comentario."
        );
      }

      const nuevo = data.comment as Comment;
      setComments((prev) => [{ ...nuevo, userId: user }, ...prev]);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditarComentario = async (comentarioId: string) => {
  try {
    setErrorComentario("");

    if (textoEditado.trim().length < 2) {
      setErrorComentario("El comentario debe tener al menos 2 caracteres.");
      return;
    }

    const respuesta = await fetch(`${API_URL}/comments/${comentarioId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contenido: textoEditado.trim() }),
    });

    const datos = await respuesta.json().catch(() => ({}));

    if (!respuesta.ok) { throw new Error(datos.message || "No se pudo editar el comentario."); }

    setComments((prev) =>
      prev.map((com) =>
        com._id === comentarioId
          ? { ...com, contenido: textoEditado.trim() }
          : com
      )
    );

    setComentarioEditando(null);
    setTextoEditado("");
  } catch (err) {
    setErrorComentario(
      err instanceof Error ? err.message : "Error al editar el comentario."
    );
  }
};

const handleEliminarComentario = async (comentarioId: string) => {
  const confirmar = window.confirm( "¿Querés eliminar este comentario?" );
  if (!confirmar) return;
  try {
    setErrorComentario("");

    const respuesta = await fetch(`${API_URL}/comments/${comentarioId}`, { method: "DELETE", });
    const datos = await respuesta.json().catch(() => ({}));

    if (!respuesta.ok) { throw new Error(datos.message || datos.error || "No se pudo eliminar el comentario."); }

    setComments((prev) => prev.filter((com) => com._id !== comentarioId) );
    } catch (err) { setErrorComentario( err instanceof Error ? err.message : "Error al eliminar el comentario." ); }
};

const handleGuardarPost = async () => {
    if (!id) return;

    try {
      setGuardandoPost(true);
      setErrorEdicionPost("");

      const respuesta = await fetch(`${API_URL}/posts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          descripcion: descripcionEditada.trim(),
          ...(nuevaImagenUrl.trim()
            ? { nuevaImagenUrl: nuevaImagenUrl.trim() }
            : {}),
        }),
      });

      const datos = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(datos.error || "No se pudo modificar la publicación.");
      }

      setPost(datos.post);
      setNuevaImagenUrl("");
      setEditandoPost(false);
    } catch (err) {
      setErrorEdicionPost(
        err instanceof Error ? err.message : "Error al modificar la publicación."
      );
    } finally {
      setGuardandoPost(false);
    }
  };

  const handleEliminarImagen = async (imagenId: string) => {
    if (!id) return;

    const confirmar = window.confirm("¿Querés eliminar esta imagen?");
    if (!confirmar) return;

    try {
      const respuesta = await fetch(`${API_URL}/posts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eliminarImagenId: imagenId,
        }),
      });

      const datos = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(datos.error || "No se pudo eliminar la imagen.");
      }

      setPost(datos.post);
    } catch (err) {
      setErrorEdicionPost(
        err instanceof Error ? err.message : "Error al eliminar la imagen."
      );
    }
  };

  const handleEliminarPost = async () => {
    if (!id) return;

    const confirmar = window.confirm( "¿Estás seguro de que querés eliminar esta publicación? Esta acción no se puede deshacer." );

    if (!confirmar) return;

    setEliminando(true);
    setErrorEliminar("");

    try {
      const respuesta = await fetch(`${API_URL}/posts/${id}`, { method: "DELETE", });

      const datos = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) { throw new Error( datos.error || datos.message || "No se pudo eliminar la publicación." ); }

      navigate(volverA, { replace: true });
    } catch (err) {
      console.error(err);
      setErrorEliminar( err instanceof Error ? err.message : "Ocurrió un error al eliminar." );
    } finally { setEliminando(false); }
  };

  if (loading) { return <p className={styles.mensajePerfil}>Cargando publicación...</p>; }

  if (error || !post) {
    return (
      <main className={styles.detailContainer}>
        <p className={styles.mensajePerfil}> {error || "Publicación no encontrada."} </p>
        <Link to={volverA} className={styles.btnVolver}> ← Volver </Link>
      </main>
    );
  }

  const autor = typeof post.userId === "object" ? post.userId : null;
  const nickName = autor?.nickName || "usuario";
  const inicial = nickName.replace(/^@/, "").charAt(0).toUpperCase();
  const imagenes = post.imagenes || [];
  const etiquetas = post.tagIds || [];
  const esMiPublicacion = !!user?._id && !!autor?._id && user._id === autor._id;

  return (
    <main className={styles.detailContainer}>
      <Link to={volverA} className={styles.btnVolver}>
        ← {volverA === "/profile" ? "Volver al perfil" : "Volver al inicio"}
      </Link>

      <article className={styles.tarjetaDetalle}>
        <div className={styles.cabeceraPost}>
          {autor?.fotoPerfil ? (
            <img className={styles.avatar}
            src={obtenerUrlImagen(autor.fotoPerfil)} alt="Foto de perfil" />
          ) : ( <div className={styles.avatar}>{inicial}</div> )}

          <div className={styles.infoUsuario}>
            <span className={styles.nickName}> @{nickName.replace(/^@/, "")} </span>
            {autor?.nombre && <span>{autor.nombre}</span>}
          </div>

          {esMiPublicacion && (
            <button type="button" className={styles.btnEditar} onClick={() => {
                setDescripcionEditada(post.descripcion);
                setEditandoPost(true);
              }}
            >
              ✎ Editar publicación
            </button>
          )}

          {esMiPublicacion && (
            <button type="button" className={styles.btnEliminar} onClick={handleEliminarPost} disabled={eliminando} >
              {eliminando ? "Eliminando..." : "⨂ Eliminar publicación"}
            </button>
          )}

          {errorEliminar && ( <p className={styles.errorEliminar}>{errorEliminar} </p> )}

        </div>

        {editandoPost ? (
          <div className={styles.formularioEdicion}>
            <h3>Editar publicación</h3>

            <label>Descripción</label>
            <textarea value={descripcionEditada} onChange={(e) => setDescripcionEditada(e.target.value)} rows={4} />

            <label>Agregar imagen mediante URL</label>
            <input type="text" value={nuevaImagenUrl}
              onChange={(e) => setNuevaImagenUrl(e.target.value)}
              placeholder="https://..."
            />

            <div className={styles.botonesEdicion}>
              <button type="button" onClick={handleGuardarPost} disabled={guardandoPost} >
                {guardandoPost ? "Guardando..." : "Guardar cambios"}
              </button>

              <button type="button" onClick={() => setEditandoPost(false)} >
                Cancelar
              </button>
            </div>

            {errorEdicionPost && ( <p className={styles.errorComentario}>{errorEdicionPost}</p> )}
          </div>
        ) : ( <p className={styles.descripcionCompleta}>{post.descripcion}</p> )};

        <p className={styles.descripcionCompleta}>{post.descripcion}</p>

        {imagenes.map((img, index) => {
          const url = obtenerUrlImagen(img.url);

          return (
            <div key={img._id || `${img.url}-${index}`} className={styles.imagenEditable}>
              <img src={url} alt="Imagen adjunta" onClick={() => setImagenSeleccionada(url)} />

              {esMiPublicacion && editandoPost && img._id && (
                <button type="button" onClick={() => handleEliminarImagen(img._id!)}>
                  Eliminar imagen
                </button>
              )}
            </div>
          );
        })}

        {etiquetas.length > 0 && (
          <div className={styles.etiquetasPublicacion}>
            {etiquetas.map((tag) => ( <span key={tag._id}>#{tag.nombre}</span> ))}
          </div>
        )}
      </article>

      <section className={styles.seccionComentarios}>
        <h3>Comentarios ({comments.length})</h3>

        {comments.length === 0 ? (
          <p className={styles.mensajePerfil}> Todavía no hay comentarios. ¡Sé el primero en comentar! </p>
        ) : (
          <div className={styles.listaComentarios}>
            {comments.map((com) => {
              const autorComentario = typeof com.userId === "object" ? com.userId : null;
              const nickComentario = autorComentario?.nickName || "usuario";
              const esMiComentario = !!user?.nickName && nickComentario === user.nickName;
              const inicialComentario = nickComentario.charAt(0).toUpperCase();

              return (
                <article key={com._id} className={styles.itemComentario}>
                  <div className={styles.cabeceraComentario}>
                    {autorComentario?.fotoPerfil ? (
                      <img
                        className={styles.avatarComentario}
                        src={obtenerUrlImagen(autorComentario.fotoPerfil)}
                        alt="Foto de perfil"
                      />
                    ) : (
                      <div className={styles.avatarComentario}> {inicialComentario} </div>
                    )}

                    <span className={styles.autorComentario}> @{nickComentario} </span>

                    {esMiComentario && (
                      <div className={styles.accionesComentario}>
                        <button type="button" onClick={() => {
                          setComentarioEditando(com._id);
                          setTextoEditado(com.contenido);
                        }}>
                          Editar
                        </button>

                        <button type="button" onClick={() => handleEliminarComentario(com._id)}>
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>

                  {comentarioEditando === com._id ? (
                    <div className={styles.edicionComentario}>
                      <textarea
                        value={textoEditado}
                        onChange={(e) => setTextoEditado(e.target.value)}
                        rows={3}
                      />

                      <div>
                        <button type="button" onClick={() => handleEditarComentario(com._id)}>
                          Guardar
                        </button>

                        <button type="button" onClick={() => {
                          setComentarioEditando(null);
                          setTextoEditado("");
                        }}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className={styles.textoComentario}>{com.contenido}</p>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {errorComentario && ( <p className={styles.errorComentario}> {errorComentario} </p> )}

        <div className={styles.formularioConAvatar}>
          {user?.fotoPerfil ? (
            <img className={styles.avatarComentario}
              src={obtenerUrlImagen(user.fotoPerfil)}
              alt="Tu foto de perfil"
            />
          ) : (
            <div className={styles.avatarComentario}>
              {user?.nickName?.charAt(0).toUpperCase() || "U"}
            </div>
          )}

          <div className={styles.formularioComentario}>
            <CommentForm onEnviarComentario={handleEnviarComentario} submitting={submitting} />
          </div>
        </div>
      </section>

      <ImageModal
        imagenUrl={imagenSeleccionada}
        onCerrar={() => setImagenSeleccionada(null)}
      />
    </main>
  );
}