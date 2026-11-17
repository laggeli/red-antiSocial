import { useState, useRef } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Posts.module.css";
import { PostImages } from "./PostImages";
import { PostTags } from "./PostTags";
import type { TagItem } from "./PostTags";
import { Button } from "../../components/botonGenerico/Button";
import { API_URL } from "../../config/api";

export const Posts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const descripcionRef = useRef<HTMLTextAreaElement | null>(null);
  const [descripcion, setDescripcion] = useState("");
  const [imagenesUrls, setImagenesUrls] = useState<string[]>([]);
  const [urlsInvalidas, setUrlsInvalidas] = useState<string[]>([]);
  const [tagsSeleccionados, setTagsSeleccionados] = useState<TagItem[]>([]);
  const [errorDescripcion, setErrorDescripcion] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!descripcion.trim()) {
      setErrorDescripcion("La descripción es obligatoria.");
      descripcionRef.current?.focus();
      return;
    }
    if (!user?._id) {
      setError("No se encontró el usuario de la sesión. Volvé a iniciar sesión.");
      return;
    }

    setEnviando(true);
    setError("");
    setErrorDescripcion("");

    try {
      const imagenesValidas = imagenesUrls.filter((url) => !urlsInvalidas.includes(url));
      const respuesta = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descripcion: descripcion.trim(),
          userId: user._id,
          tagIds: tagsSeleccionados.map((tag) => tag._id),
          imagenesUrls: imagenesValidas,
        }),
      });

      const datos = await respuesta.json().catch(() => ({}));
      if (!respuesta.ok) throw new Error(datos.error || datos.message || "No se pudo crear la publicación.");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Ocurrió un error al publicar.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <h1 className={styles.titulo}>Crear nueva publicación</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.campoGrupo}>
            <label htmlFor="descripcion" className={styles.label}>Descripción</label>
            <textarea
              ref={descripcionRef}
              id="descripcion"
              className={`${styles.textarea} ${errorDescripcion ? styles.textareaError : ""}`}
              placeholder={`¿Qué te gustaría compartir hoy, @${user?.nickName || ""}?`}
              value={descripcion}
              onChange={(e) => { setDescripcion(e.target.value); setErrorDescripcion(""); }}
              rows={4}
            />
            {errorDescripcion && <span className={styles.leyendaError}>{errorDescripcion}</span>}
          </div>
          <PostImages imagenesUrls={imagenesUrls} onChangeImagenes={setImagenesUrls} onUrlsInvalidasChange={setUrlsInvalidas} />
          <PostTags tagsSeleccionados={tagsSeleccionados} onChangeTags={setTagsSeleccionados} />
          {error && <p className={styles.mensajeError}>{error}</p>}
          <div className={styles.acciones}>
            <Button variant="cancelar" onClick={() => navigate(-1)} disabled={enviando}>Cancelar</Button>
            <Button type="submit" variant="primario" disabled={enviando}>{enviando ? "Publicando..." : "Publicar"}</Button>
          </div>
        </form>
      </section>
    </main>
  );
};
export default Posts;
