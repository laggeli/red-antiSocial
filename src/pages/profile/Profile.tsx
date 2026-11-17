import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import type { User, Post, PostProfile } from "../../types/PerfilTypes";
import DataUser from "../../components/DataUser";
import Posteo from "../../components/Posteo";
import { API_URL } from "../../config/api";
import "./ProfileLight.css";
import "./ProfileDark.css";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [usuario, setUsuario] = useState<User | null>(user);
  const [publicaciones, setPublicaciones] = useState<PostProfile[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.nickName) {
      setError("No hay un usuario activo. Volvé a iniciar sesión.");
      setCargando(false);
      return;
    }

    const cargarPerfil = async () => {
      try {
        setCargando(true);
        setError("");

        const respuestaUsuario = await fetch(`${API_URL}/users/${encodeURIComponent(user.nickName)}`);
        if (!respuestaUsuario.ok) throw new Error("No se pudo obtener el usuario.");
        const datosUsuario: User = await respuestaUsuario.json();
        setUsuario(datosUsuario);
        updateUser(datosUsuario);

        const respuestaPosts = await fetch(`${API_URL}/posts?userId=${datosUsuario._id}`);
        if (!respuestaPosts.ok) throw new Error("No se pudieron obtener tus publicaciones.");
        const posts: Post[] = await respuestaPosts.json();

        const completas: PostProfile[] = await Promise.all(posts.map(async (post) => {
          let cantidadComentarios = 0;
          try {
            const respuestaComentarios = await fetch(`${API_URL}/posts/${post._id}/comments`);
            if (respuestaComentarios.ok) {
              const comentarios = await respuestaComentarios.json();
              cantidadComentarios = Array.isArray(comentarios) ? comentarios.length : 0;
            }
          } catch (err) {
            console.error("No se pudieron cargar los comentarios del post", err);
          }
          return { ...post, cantidadComentarios };
        }));

        setPublicaciones(completas);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Ocurrió un error al cargar el perfil.");
      } finally {
        setCargando(false);
      }
    };

    cargarPerfil();
  }, [user?.nickName]);

  if (cargando) return <p className="mensajePerfil">Cargando perfil...</p>;
  if (error) return <p className="mensajePerfil">{error}</p>;
  if (!usuario) return <p className="mensajePerfil">No se encontró el usuario.</p>;

  return (
    <main className="perfil perfil-claro">
      <header className="encabezadoPerfil"><h1>Mi perfil</h1></header>
      <DataUser usuario={usuario} cantidadPublicaciones={publicaciones.length} />
      <section className="seccionPublicaciones">
        <h2>Mis publicaciones</h2>
        {publicaciones.length === 0 ? (
          <p className="mensajePerfil">Todavía no realizaste ninguna publicación.</p>
        ) : publicaciones.map((publicacion) => (
          <Posteo key={publicacion._id} publicacion={publicacion} />
        ))}
      </section>
    </main>
  );
}
