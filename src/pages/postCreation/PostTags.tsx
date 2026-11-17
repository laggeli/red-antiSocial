import { useState, useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";
import styles from "./Posts.module.css";
import { API_URL } from "../../config/api";

export interface TagItem { _id: string; nombre: string; }

interface PostTagsProps {
  tagsSeleccionados: TagItem[];
  onChangeTags: (nuevosTags: TagItem[]) => void;
}

export const PostTags = ({ tagsSeleccionados, onChangeTags }: PostTagsProps) => {
  const tagInputRef = useRef<HTMLInputElement | null>(null);
  const [tagsDisponibles, setTagsDisponibles] = useState<TagItem[]>([]);
  const [inputEtiqueta, setInputEtiqueta] = useState("");
  const [errorTags, setErrorTags] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/tags`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron cargar las etiquetas");
        return res.json();
      })
      .then((data: TagItem[]) => setTagsDisponibles(data))
      .catch((err) => console.error(err));
  }, []);

  const seleccionarTagPorNombre = (nombreRaw: string) => {
    const limpia = nombreRaw.trim().replace(/^#/, "").toLowerCase();
    if (!limpia) return;
    const encontrada = tagsDisponibles.find((t) => t.nombre.toLowerCase() === limpia);
    if (!encontrada) {
      setErrorTags(`La etiqueta #${limpia} no existe. Elegí una de las opciones.`);
      tagInputRef.current?.focus();
      return;
    }
    if (tagsSeleccionados.some((t) => t._id === encontrada._id)) {
      setErrorTags(`La etiqueta #${encontrada.nombre} ya fue agregada.`);
      return;
    }
    setErrorTags("");
    onChangeTags([...tagsSeleccionados, encontrada]);
    setInputEtiqueta("");
  };

  const toggleTag = (tag: TagItem) => {
    setErrorTags("");
    const existe = tagsSeleccionados.some((t) => t._id === tag._id);
    onChangeTags(existe ? tagsSeleccionados.filter((t) => t._id !== tag._id) : [...tagsSeleccionados, tag]);
  };

  const handleKeyDownEtiqueta = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      seleccionarTagPorNombre(inputEtiqueta);
    } else if (e.key === "Backspace" && !inputEtiqueta && tagsSeleccionados.length) {
      onChangeTags(tagsSeleccionados.slice(0, -1));
    }
  };

  return (
    <div className={styles.campoGrupo}>
      <label htmlFor="etiquetas" className={styles.label}>Etiquetas</label>
      <div className={`${styles.tagsBox} ${errorTags ? styles.tagsBoxError : ""}`}>
        {tagsSeleccionados.map((tag) => (
          <span key={tag._id} className={styles.tagChip}>
            #{tag.nombre}
            <button type="button" className={styles.tagRemove} onClick={() => toggleTag(tag)} aria-label={`Quitar ${tag.nombre}`}>×</button>
          </span>
        ))}
        <input
          ref={tagInputRef}
          id="etiquetas"
          type="text"
          className={styles.tagInput}
          placeholder="Escribí una etiqueta y presioná Enter..."
          value={inputEtiqueta}
          onChange={(e) => { setInputEtiqueta(e.target.value); setErrorTags(""); }}
          onKeyDown={handleKeyDownEtiqueta}
        />
      </div>
      {errorTags && <span className={styles.leyendaError}>{errorTags}</span>}
      {tagsDisponibles.length > 0 && (
        <div className={styles.tagsSugeridos}>
          {tagsDisponibles.filter((t) => t.nombre.toLowerCase().includes(inputEtiqueta.trim().toLowerCase())).map((tag) => {
            const activo = tagsSeleccionados.some((t) => t._id === tag._id);
            return <button key={tag._id} type="button" className={`${styles.tagSugeridoBtn} ${activo ? styles.tagSugeridoActivo : ""}`} onClick={() => toggleTag(tag)}>#{tag.nombre}</button>;
          })}
        </div>
      )}
    </div>
  );
};
export default PostTags;