import { useEffect, useState, useRef } from "react";
import type { ChangeEvent, SubmitEvent } from "react";
import { Camera, XLg } from "react-bootstrap-icons";
import type { User } from "../../types/PerfilTypes";
import { API_URL, obtenerUrlImagen } from "../../config/api";
import Button from "../botonGenerico/Button";
import ButtonIcon from "../botonGenerico/ButtonIcon";
import ConfirmModal from "../confirmModal/ConfirmModal";
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [nombre, setNombre] = useState(usuario.nombre || "");
  const [nickName, setNickName] = useState(usuario.nickName);
  const [email, setEmail] = useState(usuario.email || "");
  const [foto, setFoto] = useState<File | null>(null);
  const [vistaPrevia, setVistaPrevia] = useState(
    usuario.fotoPerfil ? obtenerUrlImagen(usuario.fotoPerfil) : ""
  );
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [confirmarGuardar, setConfirmarGuardar] = useState(false);

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

  // Valida datos y abre el modal de confirmación
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
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
    setConfirmarGuardar(true);
  };

  //Ejecuta el PATCH al confirma en el modal
  const handleConfirmarGuardar = async () => {
    const formData = new FormData();
    formData.append("nombre", nombre.trim());
    formData.append("nickName", nickName.trim());
    formData.append("email", email.trim());

    if (foto) {
      formData.append("fotoPerfil", foto);
    }

    try {
      setGuardando(true);
      setError("");

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
      
      setConfirmarGuardar(false);
      onGuardar(datos.user);
    } catch (err) {
      setConfirmarGuardar(false);
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
    <>
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

            <ButtonIcon
                variant="cancelar"
                icon={<XLg size={15} />}
                onClick={onCerrar}
                disabled={guardando}
                title="Cerrar"
                aria-label="Cerrar"
            />
          </div>

          <form onSubmit={handleSubmit} noValidate>
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

              <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFoto}
                  style={{ display: "none" }}
              />

              <ButtonIcon
                  variant="secundario"
                  icon={<Camera size={16} />}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={guardando}
              >
                Cambiar foto
              </ButtonIcon>

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
                <Button
                  variant="cancelar"
                  fullMobile
                  onClick={onCerrar}
                  disabled={guardando}
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  variant="primario"
                  fullMobile
                  disabled={guardando}
                >
                  {guardando ? "Guardando..." : "Guardar cambios"}
                </Button>
            </div>
          </form>
        </section>
      </div>
      <ConfirmModal
        abierto={confirmarGuardar}
        titulo="¿Guardar cambios en tu perfil?"
        mensaje="Se actualizará tu información personal y tu foto de perfil."
        textoConfirmar="Sí, guardar"
        textoCargando="Guardando..."
        textoCancelar="Seguir editando"
        varianteConfirmar="primario"
        cargando={guardando}
        onCancelar={() => setConfirmarGuardar(false)}
        onConfirmar={handleConfirmarGuardar}
      />
    </>
  );
}
