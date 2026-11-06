import { useEffect, useState } from "react";
import type { User, Post } from "../../types/PerfilTypes";
import DataUser from "../../components/DataUser";
import PostProfile from "../../components/PostProfile";
import "./ProfileLight.css";
import "./ProfileDark.css";

const API_URL = "/api";

interface PerfilProps {
  nickName: string;
  onLogout: () => void;
  modoOscuro?: boolean;
}

function Profile({
  nickName,
  onLogout,
  modoOscuro = false
}: PerfilProps) {

  const [usuario, setUsuario] = useState<User | null>(null);
  const [publicaciones, setPublicaciones] = useState<Post[]>([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setCargando(true);
        setError("");

        const respuestaUsuario = await fetch( // obtener los datos del usuario
          `${API_URL}/users/${encodeURIComponent(nickName)}`
        );

        if (!respuestaUsuario.ok) { throw new Error("No se pudo obtener el usuario"); }
        const datosUsuario: User = await respuestaUsuario.json();
        setUsuario(datosUsuario);
        
        const respuestaPublicaciones = await fetch( `${API_URL}/posts` ); // obtener todas las publicaciones

        if (!respuestaPublicaciones.ok) { throw new Error("No se pudieron obtener las publicaciones"); }

        const datosPublicaciones: Post[] = await respuestaPublicaciones.json();

        const publicacionesUsuario = datosPublicaciones.filter( // filtrar las publicaciones del usuario
          (publicacion) => publicacion.userId?._id === datosUsuario._id
        );

        setPublicaciones(publicacionesUsuario);
      } catch (error) {
        console.error(error);
        setError("Ocurrió un error al cargar el perfil.");
      } finally { setCargando(false); }
    };

    obtenerDatos();
  }, [nickName]);

  if (cargando) { // estado de carga
    return ( <p className="mensajePerfil"> Cargando perfil... </p> );
  }

  if (error) { // estado de error
    return ( <p className="mensajePerfil"> {error} </p> );
  }

  if (!usuario) { // si no encuwntra al usuario
    return ( <p className="mensajePerfil"> No se encontró el usuario. </p> );
  }

  return (
    <main className={modoOscuro ? "perfil perfil-oscuro" : "perfil perfil-claro"}>
      <header className="encabezadoPerfil">
        <h1>Mi perfil</h1>
        <button className="botonCerrarSesion" onClick={onLogout}> Cerrar sesión </button>
      </header>

      <DataUser usuario={usuario} cantidadPublicaciones={publicaciones.length} />

      <section className="seccionPublicaciones">
        <h2>Mis publicaciones</h2>

        {publicaciones.length === 0 ? (
          <p className="mensajePerfil"> Todavía no realizaste ninguna publicación. </p>
        ) : (
          publicaciones.map((publicacion) => ( <PostProfile key={publicacion._id} publicacion={publicacion} /> ))
        )}
      </section>
    </main>
  );
}

export default Profile;