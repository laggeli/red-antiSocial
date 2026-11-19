import { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Trash3, XLg } from "react-bootstrap-icons";
import { useAuth } from "../../context/AuthContext";
import type { PostDetailModel } from "../../types/PostDetailTypes";
import type { Comment } from "../../types/PerfilTypes";
import { CommentForm } from "../../components/postDetails/CommentForm";
import { ImageModal } from "../../components/postDetails/ImageModal";
import { PostImages } from "../../components/postCreation/PostImages";
import Button from "../../components/botonGenerico/Button";
import ButtonIcon from "../../components/botonGenerico/ButtonIcon";
import styles from "./PostDetail.module.css";
import { API_URL, obtenerUrlImagen } from "../../config/api";

interface NavigationState {
  from?: string;
  perfilNickName?: string;
}

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navState = location.state as NavigationState | null;
  const origen = navState?.from || "/";
  const perfilNickName = navState?.perfilNickName;

  const nickOrigenLimpio = perfilNickName?.replace(/^@/, "") || "";
  const nickUsuarioLogueado = user?.nickName?.replace(/^@/, "") || "";

  const esPerfilPropio =
    !!nickOrigenLimpio &&
    !!nickUsuarioLogueado &&
    nickOrigenLimpio === nickUsuarioLogueado;

  const volverA =
    origen === "/profile"
      ? esPerfilPropio || !nickOrigenLimpio
        ? "/profile"
        : `/profile/${encodeURIComponent(nickOrigenLimpio)}`
      : origen;

  const textoVolver =
    origen === "/profile"
      ? esPerfilPropio || !nickOrigenLimpio
        ? "Volver a mi perfil"
        : `Volver al perfil de @${nickOrigenLimpio}`
      : origen.startsWith("/explore")
        ? "Volver a explorar"
        : "Volver al inicio";
      
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
  const [nuevasImagenesUrls, setNuevasImagenesUrls] = useState<string[]>([]);
  const [urlsInvalidas, setUrlsInvalidas] = useState<string[]>([]);
  const [nuevosArchivos, setNuevosArchivos] = useState<File[]>([]);
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
        setError(
          err instanceof Error
            ? err.message
            : "Error al cargar la publicación."
        );
      } finally {
        setLoading(false);
      }
    };

    cargarDetalle();
  }, [id]);

  // Crear comentario
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

      const usuarioComentario = {
        _id: user._id,
        nickName: user.nickName,
        nombre: user.nombre,
        email: user.email,
        fotoPerfil: user.fotoPerfil,
      };

      setComments((prev) => [
        { ...nuevo, userId: usuarioComentario },
        ...prev,
      ]);
    } finally {
      setSubmitting(false);
    }
  };

  // Editar comentario
  const handleEditarComentario = async (comentarioId: string) => {
    if (textoEditado.trim().length < 2) {
      setErrorComentario("El comentario debe tener al menos 2 caracteres.");
      return;
    }

    try {
      setErrorComentario("");

      const respuesta = await fetch(`${API_URL}/comments/${comentarioId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contenido: textoEditado.trim() }),
      });

      const datos = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(
          datos.message || datos.error || "No se pudo editar el comentario."
        );
      }

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

  // Eliminar comentario
  const handleEliminarComentario = async (comentarioId: string) => {
    if (!window.confirm("¿Querés eliminar este comentario?")) return;

    try {
      setErrorComentario("");

      const respuesta = await fetch(`${API_URL}/comments/${comentarioId}`, {
        method: "DELETE",
      });

      const datos = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(
          datos.message || datos.error || "No se pudo eliminar el comentario."
        );
      }

      setComments((prev) => prev.filter((com) => com._id !== comentarioId));
    } catch (err) {
      setErrorComentario(
        err instanceof Error ? err.message : "Error al eliminar el comentario."
      );
    }
  };

  // Guardar cambios de la publicación
  const handleGuardarPost = async () => {
    if (!id) return;

    if (!descripcionEditada.trim()) {
      setErrorEdicionPost("La descripción no puede estar vacía.");
      return;
    }

    try {
      setGuardandoPost(true);
      setErrorEdicionPost("");

      const imagenesValidas = nuevasImagenesUrls.filter(
        (url) => !urlsInvalidas.includes(url)
      );

      const formData = new FormData();
      formData.append("descripcion", descripcionEditada.trim());

      imagenesValidas.forEach((url) => {
        formData.append("imagenesUrls", url);
      });

      nuevosArchivos.forEach((archivo) => {
        formData.append("imagenes", archivo);
      });

      const respuesta = await fetch(`${API_URL}/posts/${id}`, {
        method: "PATCH",
        body: formData,
      });

      const datos = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(
          datos.error || datos.message || "No se pudo modificar la publicación."
        );
      }

      setPost(datos.post);
      setNuevasImagenesUrls([]);
      setUrlsInvalidas([]);
      setNuevosArchivos([]);
      setEditandoPost(false);
    } catch (err) {
      setErrorEdicionPost(
        err instanceof Error ? err.message : "Error al modificar la publicación."
      );
    } finally {
      setGuardandoPost(false);
    }
  };

  // Eliminar imagen de la publicación
  const handleEliminarImagen = async (imagenId: string) => {
    if (!id) return;
    if (!window.confirm("¿Querés eliminar esta imagen?")) return;

    try {
      setErrorEdicionPost("");

      const respuesta = await fetch(`${API_URL}/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eliminarImagenId: imagenId }),
      });

      const datos = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(
          datos.error || datos.message || "No se pudo eliminar la imagen."
        );
      }

      setPost(datos.post);
    } catch (err) {
      setErrorEdicionPost(
        err instanceof Error ? err.message : "Error al eliminar la imagen."
      );
    }
  };

  // Eliminar publicación
  const handleEliminarPost = async () => {
    if (!id) return;

    const confirmar = window.confirm(
      "¿Estás seguro de que querés eliminar esta publicación? Esta acción no se puede deshacer."
    );

    if (!confirmar) return;

    setEliminando(true);
    setErrorEliminar("");

    try {
      const respuesta = await fetch(`${API_URL}/posts/${id}`, {
        method: "DELETE",
      });

      const datos = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(
          datos.error || datos.message || "No se pudo eliminar la publicación."
        );
      }

      navigate(volverA, { replace: true });
    } catch (err) {
      setErrorEliminar(
        err instanceof Error ? err.message : "Ocurrió un error al eliminar."
      );
    } finally {
      setEliminando(false);
    }
  };

  if (loading) {
    return <p className={styles.mensajePerfil}>Cargando publicación...</p>;
  }

  if (error || !post) {
    return (
      <main className={styles.detailContainer}>
        <p className={styles.mensajePerfil}>
          {error || "Publicación no encontrada."}
        </p>

        <ButtonIcon
          variant="primario"
          icon={<ArrowLeft size={16} />}
          to={volverA}
          className={styles.btnVolverWrapper}
        >
          Volver
        </ButtonIcon>
      </main>
    );
  }

  const autor = typeof post.userId === "object" ? post.userId : null;
  const nickName = autor?.nickName || "usuario";
  const inicial = nickName.replace(/^@/, "").charAt(0).toUpperCase();
  const imagenes = post.imagenes || [];
  const etiquetas = post.tagIds || [];

  const esMiPublicacion =
    !!user?._id && !!autor?._id && user._id === autor._id;

  return (
    <main className={styles.detailContainer}>
      <ButtonIcon
        variant="primario"
        icon={<ArrowLeft size={16} />}
        to={volverA}
        className={styles.btnVolverWrapper}
      >
        {textoVolver}
      </ButtonIcon>

      <article className={styles.tarjetaDetalle}>
        <div className={styles.cabeceraPost}>
          {autor?.fotoPerfil ? (
            <img
              className={styles.avatar}
              src={obtenerUrlImagen(autor.fotoPerfil)}
              alt="Foto de perfil"
            />
          ) : (
            <div className={styles.avatar}>{inicial}</div>
          )}

          <div className={styles.infoUsuario}>
            <Link
              to={`/profile/${encodeURIComponent(nickName)}`}
              className={styles.nickName}
            >
              @{nickName.replace(/^@/, "")}
            </Link>

            {autor?.nombre && <span>{autor.nombre}</span>}
          </div>

          {esMiPublicacion && (
            <div className={styles.accionesPost}>
              <ButtonIcon
                variant="secundario"
                icon={<Pencil size={16} />}
                onClick={() => {
                  setDescripcionEditada(post.descripcion);
                  setErrorEdicionPost("");
                  setEditandoPost(true);
                }}
                title="Editar publicación"
                aria-label="Editar publicación"
              />

              <ButtonIcon
                variant="peligro"
                icon={<Trash3 size={16} />}
                onClick={handleEliminarPost}
                disabled={eliminando}
                title={eliminando ? "Eliminando..." : "Eliminar publicación"}
                aria-label="Eliminar publicación"
              />
            </div>
          )}
        </div>

        {errorEliminar && (
          <p className={styles.errorMensaje}>{errorEliminar}</p>
        )}

        {editandoPost ? (
          <div className={styles.formularioEdicion}>
            <h3>Editar publicación</h3>

            <label htmlFor="descripcionEditada">Descripción</label>
            <textarea
              id="descripcionEditada"
              value={descripcionEditada}
              onChange={(e) => setDescripcionEditada(e.target.value)}
              rows={4}
            />

            <label>Agregar nuevas imágenes</label>
            <PostImages
              imagenesUrls={nuevasImagenesUrls}
              onChangeImagenes={setNuevasImagenesUrls}
              archivos={nuevosArchivos}
              onChangeArchivos={setNuevosArchivos}
              onUrlsInvalidasChange={setUrlsInvalidas}
              maxImagenes={Math.max(0, 5 - imagenes.length)}
            />

            {errorEdicionPost && (
              <p className={styles.errorMensaje}>{errorEdicionPost}</p>
            )}

            <div className={styles.botonesEdicion}>
              <Button
                variant="primario"
                fullMobile
                onClick={handleGuardarPost}
                disabled={guardandoPost}
              >
                {guardandoPost ? "Guardando..." : "Guardar cambios"}
              </Button>

              <Button
                variant="cancelar"
                fullMobile
                onClick={() => {
                  setEditandoPost(false);
                  setNuevasImagenesUrls([]);
                  setUrlsInvalidas([]);
                  setNuevosArchivos([]);
                  setErrorEdicionPost("");
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <p className={styles.descripcionCompleta}>{post.descripcion}</p>
        )}

        {imagenes.length > 0 && (
          <div className={styles.imagenesDetalle}>
            {imagenes.map((img, index) => {
              const url = obtenerUrlImagen(img.url);

              return (
                <div
                  key={img._id || `${img.url}-${index}`}
                  className={styles.imagenEditable}
                >
                  <img
                    src={url}
                    alt="Imagen adjunta"
                    onClick={() => setImagenSeleccionada(url)}
                  />

                  {esMiPublicacion && editandoPost && img._id && (
                    <ButtonIcon
                      variant="flotante"
                      icon={<XLg size={14} />}
                      onClick={() => handleEliminarImagen(img._id!)}
                      title="Eliminar imagen"
                      aria-label="Eliminar imagen"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {etiquetas.length > 0 && (
          <div className={styles.etiquetasPublicacion}>
            {etiquetas.map((tag) => (
              <Link
                key={tag._id}
                to={`/explore?tag=${encodeURIComponent(tag.nombre)}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span>#{tag.nombre}</span>
              </Link>
            ))}
          </div>
        )}
      </article>

      <section className={styles.seccionComentarios}>
        <h3 className={styles.tituloSeccion}>
          {comments.length === 1
            ? "Comentario (1)"
            : `Comentarios (${comments.length})`}
        </h3>

        {comments.length === 0 ? (
          <p className={styles.mensajeSinComentarios}>
            Todavía no hay comentarios. ¡Sé el primero en comentar!
          </p>
        ) : (
          <div className={styles.listaComentarios}>
            {comments.map((com) => {
              const autorComentario =
                typeof com.userId === "object" ? com.userId : null;

              const nickComentario = autorComentario?.nickName || "usuario";
              const nickLimpio = nickComentario.replace(/^@/, "");

              const esMiComentario =
                !!user?.nickName && nickLimpio === user.nickName.replace(/^@/, "");

              const inicialComentario = nickLimpio.charAt(0).toUpperCase();

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
                      <div className={styles.avatarComentario}>
                        {inicialComentario}
                      </div>
                    )}

                    <Link
                      to={`/profile/${encodeURIComponent(nickLimpio)}`}
                      className={styles.autorComentario}
                    >
                      @{nickLimpio}
                    </Link>

                    {esMiComentario && (
                      <div className={styles.accionesComentario}>
                        <ButtonIcon
                          variant="secundario"
                          icon={<Pencil size={14} />}
                          className={styles.btnComentarioIcono}
                          onClick={() => {
                            setComentarioEditando(com._id);
                            setTextoEditado(com.contenido);
                            setErrorComentario("");
                          }}
                          title="Editar comentario"
                          aria-label="Editar comentario"
                        />

                        <ButtonIcon
                          variant="peligro"
                          icon={<Trash3 size={14} />}
                          className={styles.btnComentarioIcono}
                          onClick={() => handleEliminarComentario(com._id)}
                          title="Eliminar comentario"
                          aria-label="Eliminar comentario"
                        />
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

                      <div className={styles.botonesEdicionComentario}>
                        <Button
                          variant="primario"
                          onClick={() => handleEditarComentario(com._id)}
                        >
                          Guardar
                        </Button>

                        <Button
                          variant="cancelar"
                          onClick={() => {
                            setComentarioEditando(null);
                            setTextoEditado("");
                            setErrorComentario("");
                          }}
                        >
                          Cancelar
                        </Button>
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

        {errorComentario && (
          <p className={styles.errorMensaje}>{errorComentario}</p>
        )}

        {user && (
          <div className={styles.bloqueNuevoComentario}>
            <div className={styles.encabezadoNuevoComentario}>
              {user.fotoPerfil ? (
                <img
                  className={styles.avatarComentario}
                  src={obtenerUrlImagen(user.fotoPerfil)}
                  alt="Tu foto de perfil"
                />
              ) : (
                <div className={styles.avatarComentario}>
                  {user.nickName?.charAt(0).toUpperCase() || "U"}
                </div>
              )}

              <Link
                to={`/profile/${encodeURIComponent(user.nickName)}`}
                className={styles.nickName}
              >
                @{user.nickName}
              </Link>
            </div>

            <div className={styles.formularioComentario}>
              <CommentForm
                onEnviarComentario={handleEnviarComentario}
                submitting={submitting}
              />
            </div>
          </div>
        )}
      </section>

      <ImageModal
        imagenUrl={imagenSeleccionada}
        onCerrar={() => setImagenSeleccionada(null)}
      />
    </main>
  );
}