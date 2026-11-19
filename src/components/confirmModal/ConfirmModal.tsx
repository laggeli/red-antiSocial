import { useEffect } from "react";
import Button from "../botonGenerico/Button";
import type { ButtonVariant } from "../../types/ButtonTypes";
import styles from "./ConfirmModal.module.css";

interface ConfirmModalProps {
  abierto: boolean;
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  textoCargando?: string;
  textoCancelar?: string;
  varianteConfirmar?: ButtonVariant;
  cargando?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export const ConfirmModal = ({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = "Confirmar",
  textoCargando,
  textoCancelar = "Cancelar",
  varianteConfirmar = "primario",
  cargando = false,
  onConfirmar,
  onCancelar,
}: ConfirmModalProps) => {
  // Cerrar con la tecla Escape
  useEffect(() => {
    if (!abierto) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !cargando) {
        onCancelar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [abierto, cargando, onCancelar]);

  if (!abierto) return null;

  return (
    <div
      className={styles.overlay}
      onClick={() => !cargando && onCancelar()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={styles.modalCard}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className={styles.titulo}>{titulo}</h3>
        <p className={styles.mensaje}>{mensaje}</p>

        <div className={styles.acciones}>
          <Button
            variant="cancelar"
            onClick={onCancelar}
            disabled={cargando}
          >
            {textoCancelar}
          </Button>

          <Button
            variant={varianteConfirmar}
            onClick={onConfirmar}
            disabled={cargando}
          >
            {cargando ? (textoCargando || "Procesando...") : textoConfirmar}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;