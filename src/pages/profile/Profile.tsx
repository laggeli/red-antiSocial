import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { User, Post, PostProfile } from "../../types/PerfilTypes";
import DataUser from "../../components/DataUser";
import Posteo from "../../components/Posteo";
import EditProfile from "../../components/editProfile/EditProfile";
import { Trash3 } from "react-bootstrap-icons";
import ButtonIcon from "../../components/botonGenerico/ButtonIcon";
import ConfirmModal from "../../components/confirmModal/ConfirmModal";
import { API_URL } from "../../config/api";
import "./ProfileLight.css";
import "./ProfileDark.css";
import { useTheme } from "../../context/ThemeContext";

export default function Profile() {
  const { nickName: nickNameRuta } = useParams<{ nickName: string }>();
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<User | null>(null);
  const [publicaciones, setPublicaciones] = useState<PostProfile[]>([]);
  const [cantidadSeguidores, setCantidadSeguidores] = useState(0);
  const [cantidadSeguidos, setCantidadSeguidos] = useState(0);
  const [siguiendo, setSiguiendo] = useState(false);
  const [teSigue, setTeSigue] = useState(false);

  const [cargando, setCargando] = useState(true);
  const [cargandoSeguimiento, setCargandoSeguimiento] = useState(false);
  const [eliminandoPerfil, setEliminandoPerfil] = useState(false);
  const [confirmarEliminarCuenta, setConfirmarEliminarCuenta] = useState(false);
  const [editando, setEditando] = useState(false);
  const [error, setError] = useState("");
  const [errorEliminarPerfil, setErrorEliminarPerfil] = useState("");

  const { theme } = useTheme();

  const nickNameObjetivo = nickNameRuta || user?.nickName;

  const esMiPerfil =
    !!user && !!usuario && user._id === usuario._id;

  useEffect(() => {
    if (!nickNameObjetivo) {
      setError("No hay un usuario activo.");
      setCargando(false);
      return;
    }

    const cargarPerfil = async () => {
      try {
        setCargando(true);
        setError("");

        const respuestaUsuario = await fetch(
          `${API_URL}/users/${encodeURIComponent(nickNameObjetivo)}`
        );

        if (!respuestaUsuario.ok) {
          throw new Error("No se pudo encontrar este usuario.");
        }

        const datosUsuario: User = await respuestaUsuario.json();
        setUsuario(datosUsuario);

        if (user && datosUsuario._id === user._id) {
          updateUser(datosUsuario);
        }

        const respuestaPosts = await fetch(
          `${API_URL}/posts?userId=${datosUsuario._id}`
        );

        if (!respuestaPosts.ok) {
          throw new Error("No se pudieron obtener las publicaciones.");
        }

        const posts: Post[] = await respuestaPosts.json();

        const completas: PostProfile[] = await Promise.all(
          posts.map(async (post) => {
            let cantidadComentarios = 0;

            try {
              const respuestaComentarios = await fetch(
                `${API_URL}/posts/${post._id}/comments`
              );

              if (respuestaComentarios.ok) {
                const comentarios = await respuestaComentarios.json();
                cantidadComentarios = Array.isArray(comentarios)
                  ? comentarios.length
                  : 0;
              }
            } catch (err) {
              console.error("Error al cargar comentarios", err);
            }

            return { ...post, cantidadComentarios };
          })
        );

        setPublicaciones(completas);

        const [resSeguidores, resSeguidos] = await Promise.all([
          fetch(`${API_URL}/users/${encodeURIComponent(datosUsuario.nickName)}/followers`),
          fetch(`${API_URL}/users/${encodeURIComponent(datosUsuario.nickName)}/following`),
        ]);

        const seguidores: User[] = resSeguidores.ok
          ? await resSeguidores.json()
          : [];

        const seguidos: User[] = resSeguidos.ok
          ? await resSeguidos.json()
          : [];

        setCantidadSeguidores(Array.isArray(seguidores) ? seguidores.length : 0);
        setCantidadSeguidos(Array.isArray(seguidos) ? seguidos.length : 0);

        if (user && datosUsuario._id !== user._id) {
          const sigoAEstaPersona = seguidores.some(
            (persona) => persona._id === user._id
          );
          const estaPersonaMeSigue = seguidos.some(
            (persona) => persona._id === user._id
          );

          setSiguiendo(sigoAEstaPersona);
          setTeSigue(estaPersonaMeSigue);
        } else {
          setSiguiendo(false);
          setTeSigue(false);
        }
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "Ocurrió un error al cargar el perfil."
        );
      } finally {
        setCargando(false);
      }
    };

    cargarPerfil();
  }, [nickNameObjetivo, user?._id]);

  const handleToggleSeguir = async () => {
    if (!user || !usuario || esMiPerfil) return;

    try {
      setCargandoSeguimiento(true);
      setError("");

      const url = `${API_URL}/users/${encodeURIComponent(user.nickName)}/following/${encodeURIComponent(usuario.nickName)}`;

      const respuesta = await fetch(url, {
        method: siguiendo ? "DELETE" : "POST",
      });

      const datos = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(
          datos.message || datos.error || "No se pudo actualizar el seguimiento."
        );
      }

      setSiguiendo(!siguiendo);
      setCantidadSeguidores((cantidad) =>
        siguiendo ? Math.max(0, cantidad - 1) : cantidad + 1
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al seguir a este usuario."
      );
    } finally {
      setCargandoSeguimiento(false);
    }
  };

  const handleGuardarPerfil = (usuarioActualizado: User) => {
    setUsuario(usuarioActualizado);
    updateUser(usuarioActualizado);
    setEditando(false);

    if (
      nickNameRuta &&
      usuarioActualizado.nickName !== nickNameRuta
    ) {
      navigate(`/profile/${encodeURIComponent(usuarioActualizado.nickName)}`);
    }
  };

  const handleEliminarPerfil = async () => {
    if (!usuario || !esMiPerfil || eliminandoPerfil) return;

    try {
      setEliminandoPerfil(true);
      setErrorEliminarPerfil("");

      const respuesta = await fetch(
        `${API_URL}/users/${encodeURIComponent(usuario.nickName)}`,
        { method: "DELETE" }
      );

      const datos = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(
          datos.error ||
          datos.message ||
          "No se pudo eliminar tu cuenta."
        );
      }

      setConfirmarEliminarCuenta(false);
      logout();
      navigate("/login", { replace: true });
    } catch (err) {
      setConfirmarEliminarCuenta(false);
      setErrorEliminarPerfil(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al eliminar la cuenta."
      );
    } finally {
      setEliminandoPerfil(false);
    }
  };

  if (cargando) {
    return <p className="mensajePerfil">Cargando perfil...</p>;
  }

  if (error && !usuario) {
    return <p className="mensajePerfil">{error}</p>;
  }

  if (!usuario) {
    return <p className="mensajePerfil">No se encontró el usuario.</p>;
  }

  return (
    <main className={`perfil ${theme === "dark" ? "perfil-oscuro" : "perfil-claro"}`}>
      <header className="encabezadoPerfil">
        <h1>{esMiPerfil ? "Mi perfil" : `Perfil de @${usuario.nickName}`}</h1>
      </header>

      {error && <p className="mensajePerfil">{error}</p>}

      <DataUser
        usuario={usuario}
        cantidadPublicaciones={publicaciones.length}
        cantidadSeguidores={cantidadSeguidores}
        cantidadSeguidos={cantidadSeguidos}
        esMiPerfil={esMiPerfil}
        siguiendo={siguiendo}
        teSigue={teSigue}
        cargandoSeguimiento={cargandoSeguimiento}
        onEditar={() => setEditando(true)}
        onToggleSeguir={handleToggleSeguir}
      />

      <section className="seccionPublicaciones">
        <h2>
          {esMiPerfil ? "Mis publicaciones" : "Publicaciones"}
        </h2>

        {publicaciones.length === 0 ? (
          <p className="mensajePerfil">
            {esMiPerfil
              ? "Todavía no realizaste ninguna publicación."
              : "Este usuario todavía no realizó publicaciones."}
          </p>
        ) : (
          publicaciones.map((publicacion) => (
            <Posteo
              key={publicacion._id}
              publicacion={publicacion}
              perfilNickName={usuario.nickName}
            />
          ))
        )}
      </section>

      {esMiPerfil && (
        <section className="zonaEliminarCuenta">
          <div className="textoEliminarCuenta">
            <h3>Eliminar cuenta</h3>
            <p>
              Si eliminás tu cuenta, tus publicaciones, comentarios y
              relaciones de seguidores también serán eliminados.
              Esta acción es permanente.
            </p>
          </div>

          {errorEliminarPerfil && (
            <p className="errorEliminarCuenta">{errorEliminarPerfil}</p>
          )}

          <ButtonIcon
            variant="peligro"
            icon={<Trash3 size={16} />}
            fullMobile
            onClick={() => setConfirmarEliminarCuenta(true)}
            disabled={eliminandoPerfil}
          >
            {eliminandoPerfil ? "Eliminando cuenta..." : "Eliminar mi cuenta"}
          </ButtonIcon>

        </section>

      )}

      <ConfirmModal
          abierto={confirmarEliminarCuenta}
          titulo="¿Eliminar tu cuenta?"
          mensaje={`Vas a eliminar de forma permanente la cuenta @${usuario.nickName}, junto con todas tus publicaciones, comentarios y seguidores. Esta acción no se puede deshacer.`}
          textoConfirmar="Sí, eliminar mi cuenta"
          textoCargando="Eliminando cuenta..."
          textoCancelar="Cancelar"
          varianteConfirmar="peligro"
          cargando={eliminandoPerfil}
          onCancelar={() => setConfirmarEliminarCuenta(false)}
          onConfirmar={handleEliminarPerfil}
      />

      {editando && esMiPerfil && (
        <EditProfile
          usuario={usuario}
          onCerrar={() => setEditando(false)}
          onGuardar={handleGuardarPerfil}
        />
      )}
    </main>
  );
}