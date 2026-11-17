import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { User } from "../../types/PerfilTypes";
import { API_URL, obtenerUrlImagen } from "../../config/api";
import styles from "./EditProfile.module.css";

interface EditProfileProps {
  usuario: User;
  onCerrar: () => void;
  onGuardar: (usuario: User) => void;
}

export default function EditProfile({
  usuario,
  onCerrar,
  onGuardar,
}: EditProfileProps) {
  const [nombre, setNombre] = useState(usuario.nombre || "");
  const [nickName, setNickName] = useState(usuario.nickName);
  const [email, setEmail] = useState(usuario.email || "");
  const [foto, setFoto] = useState<File | null>(null);
  const [vistaPrevia, setVistaPrevia] = useState(
    usuario.fotoPerfil ? obtenerUrlImagen(usuario.fotoPerfil) : ""
  );
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!foto) return;

    const url = URL.createObjectURL(foto);
    setVistaPrevia(url);

    return () => URL.revokeObjectURL(url);
  }, [foto]);

  const handleFoto = (e: ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];

    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {
      setError("Seleccioná un archivo de imagen válido.");
      e.target.value = "";
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar los 5 MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setFoto(archivo);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const nombreLimpio = nombre.trim();
    const nickLimpio = nickName.trim();
    const emailLimpio = email.trim();

    if (nombreLimpio.length < 3) {
      setError("El nombre debe tener al menos 3 caracteres.");
      return;
    }

    if (nickLimpio.length < 3 || nickLimpio.length > 20) {
      setError("El nickname debe tener entre 3 y 20 caracteres.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpio)) {
      setError("Ingresá un email válido.");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombreLimpio);
    formData.append("nickName", nickLimpio);
    formData.append("email", emailLimpio);

    if (foto) {
      formData.append("fotoPerfil", foto);
    }

    try {
      setGuardando(true);

      const respuesta = await fetch(
        `${API_URL}/users/${encodeURIComponent(usuario.nickName)}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      const datos = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        if (respuesta.status === 409) {
          throw new Error(
            datos.error || "Ese nickname o email ya está registrado."
          );
        }

        const errores = Array.isArray(datos.errors)
          ? datos.errors.join(" ")
          : "";

        throw new Error(
          datos.error || errores || datos.message ||
          "No se pudieron guardar los cambios."
        );
      }

      if (!datos.user) {
        throw new Error("El servidor no devolvió los datos actualizados.");
      }

      onGuardar(datos.user);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al actualizar el perfil."
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className={styles.fondoModal} onClick={onCerrar}>
      <section
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.encabezado}>
          <div>
            <h2>Editar perfil</h2>
            <p>Actualizá tu información personal.</p>
          </div>

          <button
            type="button"
            className={styles.btnCerrar}
            onClick={onCerrar}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.fotoSeccion}>
            {vistaPrevia ? (
              <img
                src={vistaPrevia}
                alt="Vista previa de la foto de perfil"
                className={styles.fotoPerfil}
              />
            ) : (
              <div className={styles.fotoInicial}>
                {nickName.charAt(0).toUpperCase() || "U"}
              </div>
            )}

            <label className={styles.btnFoto}>
              Cambiar foto
              <input
                type="file"
                accept="image/*"
                onChange={handleFoto}
              />
            </label>

            <span className={styles.ayuda}>
              Formatos de imagen. Máximo 5 MB.
            </span>
          </div>

          <div className={styles.campo}>
            <label htmlFor="nombrePerfil">Nombre</label>
            <input
              id="nombrePerfil"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              maxLength={50}
              required
            />
          </div>

          <div className={styles.campo}>
            <label htmlFor="nicknamePerfil">Nickname</label>
            <input
              id="nicknamePerfil"
              type="text"
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
              minLength={3}
              maxLength={20}
              required
            />
          </div>

          <div className={styles.campo}>
            <label htmlFor="emailPerfil">Email</label>
            <input
              id="emailPerfil"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.botones}>
            <button
              type="button"
              className={styles.btnCancelar}
              onClick={onCerrar}
              disabled={guardando}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className={styles.btnGuardar}
              disabled={guardando}
            >
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
