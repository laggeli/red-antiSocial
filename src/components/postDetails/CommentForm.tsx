import { useState } from "react";
import type { SyntheticEvent } from "react";
import styles from "./CommentForm.module.css"; 

interface CommentFormProps {
  onEnviarComentario: (texto: string) => Promise<void>;
  submitting: boolean;
}

export const CommentForm = ({ onEnviarComentario, submitting }: CommentFormProps) => {
  const [texto, setTexto] = useState("");
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorLocal(null);

    if (!texto.trim()) {
      setErrorLocal("El comentario no puede estar vacío.");
      return;
    }

    try {
      await onEnviarComentario(texto.trim());
      setTexto("");
    } catch (err) {
      setErrorLocal(err instanceof Error ? err.message : "Error al enviar el comentario.");
    }
  };

  return (
    <>
      <h4 className={styles.tituloComentario}>Agregar un comentario</h4>
      {errorLocal && <p className={styles.mensajeError}>{errorLocal}</p>}

      {/* aplicamos las clases del modulo */}
      <form onSubmit={handleSubmit} className={styles.formComentario} noValidate>
        <textarea
          rows={3}
          className={styles.textareaComentario}
          placeholder="Escribe tu comentario aquí..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          disabled={submitting}
        />
        <button type="submit" className={styles.btnPublicar} disabled={submitting}>
          {submitting ? "Enviando..." : "Publicar comentario"}
        </button>
      </form>
    </>
  );
};