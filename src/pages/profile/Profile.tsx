import { useEffect, useState } from "react";
import type { User, Post, PostProfile, Comment, Image } from "../../types/PerfilTypes";

import DataUser from "../../components/DataUser";
import Posteo from "../../components/Posteo";

import "./ProfileLight.css";
import "./ProfileDark.css";

const API_URL = "http://localhost:3001";

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
  const [publicaciones, setPublicaciones] = useState<PostProfile[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  async function loadUser(): Promise<void> { // busca al usuario y carga los posteos

    setCargando(true);
    setError("");

    try { // obtener usuarios
      const respuestaUsuarios = await fetch(`${API_URL}/users`); 

      if (!respuestaUsuarios.ok) { throw new Error("Error al cargar los usuarios"); }

      const usuarios: User[] = await respuestaUsuarios.json();

      const usuarioEncontrado = usuarios.find( // buscar al user por su nickname
        (user: User) => user.nickName === nickName
      );

      if (!usuarioEncontrado) { throw new Error("No se encontró el usuario"); }

      setUsuario(usuarioEncontrado);

      const respuestaPublicaciones = await fetch( // obtener los posts del usuario
        `${API_URL}/posts?userId=${usuarioEncontrado.id}`
      );

      if (!respuestaPublicaciones.ok) { throw new Error("Error al cargar las publicaciones"); }

      const datosPublicaciones: Post[] = await respuestaPublicaciones.json()
     
      const publicacionesCompletas: PostProfile[] = await Promise.all( // obtener los comentarios e imsgenes de cada posteo

        datosPublicaciones.map(async (publicacion: Post) => {
          const respuestaComentarios = await fetch( `${API_URL}/comments/post/${publicacion.id}` );

          if (!respuestaComentarios.ok) { throw new Error("Error al cargar los comentarios"); }

          const comentarios: Comment[] = await respuestaComentarios.json();

          const respuestaImagenes = await fetch( `${API_URL}/postimages/post/${publicacion.id}` );

          if (!respuestaImagenes.ok) { throw new Error("Error al cargar las imágenes"); }

          const imagenes: Image[] = await respuestaImagenes.json();

          return {...publicacion, cantidadComentarios: comentarios.length, imagenes: imagenes };
        })
      );

      setPublicaciones(publicacionesCompletas);

    } catch (error) {

      console.error(error);
      setError("Ocurrió un error al cargar el perfil.");

    } finally { setCargando(false); }
  }

  useEffect(() => { loadUser(); }, [nickName]); // cargar el perfil al entrar

  if (cargando) { return <p className="mensajePerfil">Cargando perfil...</p>; }
  if (error) { return <p className="mensajePerfil">{error}</p>; }
  if (!usuario) { return <p className="mensajePerfil">No se encontró el usuario.</p>; } // 


  return (
    <main className={ modoOscuro ? "perfil perfil-oscuro": "perfil perfil-claro" }>

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

          publicaciones.map((publicacion: PostProfile) => (
            <Posteo key={publicacion.id} publicacion={publicacion} />
          ))
        )}
      </section>
    </main>
  );
}

export default Profile;