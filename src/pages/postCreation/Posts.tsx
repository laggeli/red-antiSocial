import { useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "../../components/postCreation/Posts.module.css";
import type { TagItem } from "../../types/PostTypes";
import { PageBanner } from "../../components/pageBanner/PageBanner";
import { PostForm } from "../../components/postCreation/PostForm";
import ConfirmModal from "../../components/confirmModal/ConfirmModal"
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
  const [confirmarPublicar, setConfirmarPublicar] = useState(false);

  //Valida los campos y abre el modal
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!descripcion.trim()) {
      setErrorDescripcion("La descripción es obligatoria!! Por favor, escribí algo para publicar.");
      return;
    }

    if (!user?._id) {
      setError("No se encontró el usuario de la sesión. Volvé a iniciar sesión.");
      return;
    }

    setError("");
    setErrorDescripcion("");
    setConfirmarPublicar(true);
  };

  // Envía la publicación al backend al confirmar
  const handleConfirmarPublicacion = async () => {
    if (!user?._id) return;

    setEnviando(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("descripcion", descripcion.trim());
      formData.append("userId", user._id);

      // Se filtran las URLs inválidas que detectó PostImages
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

      setConfirmarPublicar(false);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setConfirmarPublicar(false);
      setError(
        err instanceof Error ? err.message : "Ocurrió un error al publicar."
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className={styles.container}>
      <PageBanner
        titulo="Crear nueva publicación"
        subtitulo="Compartí tus ideas, apuntes o proyectos con la comunidad universitaria."
      />
      
      <div className={styles.wrapper}>
        <PostForm
          descripcion={descripcion}
          setDescripcion={setDescripcion}
          imagenesUrls={imagenesUrls}
          setImagenesUrls={setImagenesUrls}
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
      </div>  

      <ConfirmModal
        abierto={confirmarPublicar}
        titulo="¿Publicar ahora?"
        mensaje="Tu publicación será visible para toda la comunidad."
        textoConfirmar="Sí, publicar"
        textoCargando="Publicando..."
        textoCancelar="Seguir editando"
        varianteConfirmar="primario"
        cargando={enviando}
        onCancelar={() => setConfirmarPublicar(false)}
        onConfirmar={handleConfirmarPublicacion}
      />
    </main>
  );
};
export default Posts;
