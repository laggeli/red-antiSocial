import { useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "../../components/postCreation/Posts.module.css";
import type { TagItem } from "../../components/postCreation/PostTags";
import { PostForm } from "../../components/postCreation/PostForm";
import { API_URL } from "../../config/api";

export const Posts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [descripcion, setDescripcion] = useState("");
  const [imagenesUrls, setImagenesUrls] = useState<string[]>([]);
  const [urlsInvalidas, setUrlsInvalidas] = useState<string[]>([]);
  const [tagsSeleccionados, setTagsSeleccionados] = useState<TagItem[]>([]);
  const [errorDescripcion, setErrorDescripcion] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [archivos, setArchivos] = useState<File[]>([]);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!descripcion.trim()) {
      setErrorDescripcion("La descripción es obligatoria.");
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
      const formData = new FormData();

      formData.append("descripcion", descripcion.trim());
      formData.append("userId", user._id);

      const imagenesValidas = imagenesUrls.filter(
        (url) => !urlsInvalidas.includes(url)
      );

      imagenesValidas.forEach((url) => {
        formData.append("imagenesUrls", url);
      });

      tagsSeleccionados.forEach((tag) => {
        formData.append("tagIds", tag._id);
      });

      archivos.forEach((archivo) => {
        formData.append("imagenes", archivo);
      });

      const respuesta = await fetch(`${API_URL}/posts`, {
        method: "POST",
        body: formData,
      });

      const datos = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(
          datos.error || datos.message || "No se pudo crear la publicación."
        );
      }

      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Ocurrió un error al publicar."
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className={styles.container}>
      <PostForm
        descripcion={descripcion}
        setDescripcion={setDescripcion}
        imagenesUrls={imagenesUrls}
        setImagenesUrls={setImagenesUrls}
        urlsInvalidas={urlsInvalidas}
        setUrlsInvalidas={setUrlsInvalidas}
        tagsSeleccionados={tagsSeleccionados}
        setTagsSeleccionados={setTagsSeleccionados}
        archivos={archivos}
        setArchivos={setArchivos}
        errorDescripcion={errorDescripcion}
        setErrorDescripcion={setErrorDescripcion}
        error={error}
        enviando={enviando}
        userNickName={user?.nickName}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </main>
  );
};
export default Posts;
