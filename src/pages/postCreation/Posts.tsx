import { useState, useRef } from "react";
import type { SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Posts.module.css";
import type { User } from "../../types/PerfilTypes";
import { PostImages } from "./PostImages";
import { PostTags } from "./PostTags";
import type { TagItem } from "./PostTags";

const API_URL = "http://localhost:3001";

interface PostsProps {
  nickName: string;
}

export const Posts = ({ nickName }: PostsProps) => {
  const navigate = useNavigate(); //hook de react-router-dom que te devuelve una función para cambiar de página (de ruta) desde el código JS, sin tener que hacer clic en un <Link> o <NavLink>.
  const descripcionRef = useRef<HTMLTextAreaElement | null>(null);//hook de React que se usa para manipular elementos del DOM sin redibujar la interfaz

  const [descripcion, setDescripcion] = useState<string>("");
  const [imagenesUrls, setImagenesUrls] = useState<string[]>([]);
  const [urlsInvalidas, setUrlsInvalidas] = useState<string[]>([]);
  const [tagsSeleccionados, setTagsSeleccionados] = useState<TagItem[]>([]);
  const [errorDescripcion, setErrorDescripcion] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [enviando, setEnviando] = useState<boolean>(false);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!descripcion.trim()) {
      setErrorDescripcion("La descripción es obligatoria!! Por favor, escribe algo antes de publicar.");
      descripcionRef.current?.focus(); // Lleva el foco directamente al textarea de descripción para que el user escriba algo
      return;
    }

    setEnviando(true);
    setErrorDescripcion("");
    setError("");

    try {
      // Se obtiene por GET /users el usuario por nickName
      const resUsers = await fetch(`${API_URL}/users`);
      if (!resUsers.ok) throw new Error("Error al obtener el usuario");

      const usuarios: User[] = await resUsers.json();
      const usuarioActual = usuarios.find((u) => u.nickName === nickName);
      if (!usuarioActual) {
        throw new Error(`No se encontró el usuario @${nickName}`);
      }

      // Se crea por POST /posts un post con description, userId y tagIds
      const tagIds = tagsSeleccionados.map((tag) => tag.id);

      const resPost = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: descripcion.trim(),
          userId: usuarioActual.id,
          tagIds,
        }),
      });

      if (!resPost.ok) {
        const errData = await resPost.json().catch(() => ({}));
        throw new Error(errData.error || "Error al crear la publicación");
      }

      const postCreado = await resPost.json();
      const imagenesValidas = 
        imagenesUrls.filter((url) => 
            !urlsInvalidas.includes(url)
        );
      // Se asocia por POST /postimages cada imagen al post creado
      if (imagenesValidas.length > 0 && postCreado?.id) {
        await Promise.all(
          imagenesValidas.map((url) =>
            fetch(`${API_URL}/postimages`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                url,
                postId: postCreado.id,
              }),
            })
          )
        );
      }

      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al publicar. Verifica la conexión con el backend.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <h1 className={styles.titulo}>Crear nueva publicación</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Descripción del Post */}
          <div className={styles.campoGrupo}>
            <label htmlFor="descripcion" className={styles.label}>
              Descripción
            </label>
            <textarea
              ref={descripcionRef}
              id="descripcion"
              className={
                `${styles.textarea} ${errorDescripcion ? styles.textareaError : ""}`
              }
              placeholder={`¿Qué quieres compartir hoy, @${nickName}?`}
              value={descripcion}
              onChange={(e) => {
                setDescripcion(e.target.value);
                if (errorDescripcion) setErrorDescripcion("");
              }}
              rows={4}
            />
            {errorDescripcion && (
              <span className={styles.leyendaError}>{errorDescripcion}</span>
            )}
          </div>

          {/* Imágenes */}
          <PostImages
            imagenesUrls={imagenesUrls}
            onChangeImagenes={setImagenesUrls}
            onUrlsInvalidasChange={setUrlsInvalidas}
          />

          {/* Etiquetas */}
          <PostTags
            tagsSeleccionados={tagsSeleccionados}
            onChangeTags={setTagsSeleccionados}
          />

          {error && <p className={styles.mensajeError}>{error}</p>}

          {/* Botones */}
          <div className={styles.acciones}>
            <button
              type="button"
              className={styles.btnCancelar}
              onClick={() => navigate(-1)}
              disabled={enviando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.btnPublicar}
              disabled={enviando}
            >
              {enviando ? "Publicando..." : "Publicar"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Posts;