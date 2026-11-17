
import { useState, useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";
import styles from "./Posts.module.css";
import { API_URL } from "../../config/api";

export interface TagItem {
  _id: string;
  nombre: string;
}

interface PostTagsProps {
  tagsSeleccionados: TagItem[];
  onChangeTags: (nuevosTags: TagItem[]) => void;
}

export const PostTags = ({
  tagsSeleccionados,
  onChangeTags,
}: PostTagsProps) => {
  const tagInputRef = useRef<HTMLInputElement | null>(null);

  const [tagsDisponibles, setTagsDisponibles] = useState<TagItem[]>([]);
  const [inputEtiqueta, setInputEtiqueta] = useState("");
  const [errorTags, setErrorTags] = useState("");

  const cargarTags = async () => {
    const respuesta = await fetch(`${API_URL}/tags`);

    if (!respuesta.ok) { throw new Error("No se pudieron cargar las etiquetas."); }

    const datos: TagItem[] = await respuesta.json();
    setTagsDisponibles(datos);

    return datos;
  };

  useEffect(() => { cargarTags().catch((error) => console.error(error)); }, []);

  const seleccionarTagPorNombre = async (nombreRaw: string) => {
    const nombre = nombreRaw.trim().replace(/^#/, "");

    if (!nombre) return;
    try {
      setErrorTags("");
      let etiquetas = tagsDisponibles;

      let encontrada = etiquetas.find( (tag) => tag.nombre.toLowerCase() === nombre.toLowerCase() );

      if (!encontrada) {
        const respuesta = await fetch(`${API_URL}/tags`, {
          method: "POST",
          headers: { "Content-Type": "application/json", },
          body: JSON.stringify({ nombre }),
        });

        if (respuesta.ok) {
          encontrada = await respuesta.json();
          setTagsDisponibles((prev) => [...prev, encontrada!]);
        } else {
          etiquetas = await cargarTags();

          encontrada = etiquetas.find(
            (tag) => tag.nombre.toLowerCase() === nombre.toLowerCase()
          );

          if (!encontrada) { throw new Error("No se pudo crear la etiqueta."); }
        }
      }
      if (!encontrada) { throw new Error("No se pudo encontrar ni crear la etiqueta."); }

      if ( tagsSeleccionados.some((tag) => tag._id === encontrada._id) ) {
        setErrorTags(`La etiqueta #${encontrada.nombre} ya fue agregada.`);
        return;
      }

      onChangeTags([...tagsSeleccionados, encontrada]);
      setInputEtiqueta("");
      setErrorTags("");
      setInputEtiqueta("");
      setErrorTags("");

    } catch (error) {
      console.error(error);
      setErrorTags(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al agregar la etiqueta."
      );
    } finally {
      tagInputRef.current?.focus();
    }
  };

  const toggleTag = (tag: TagItem) => {
    setErrorTags("");

    const existe = tagsSeleccionados.some(
      (seleccionada) => seleccionada._id === tag._id
    );

    if (existe) {
      onChangeTags(
        tagsSeleccionados.filter(
          (seleccionada) => seleccionada._id !== tag._id
        )
      );
    } else {
      onChangeTags([...tagsSeleccionados, tag]);
    }
  };

  const handleKeyDownEtiqueta = (
    e: KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      seleccionarTagPorNombre(inputEtiqueta);
    } else if (
      e.key === "Backspace" &&
      !inputEtiqueta &&
      tagsSeleccionados.length
    ) {
      onChangeTags(tagsSeleccionados.slice(0, -1));
    }
  };

  return (
    <div className={styles.campoGrupo}>
      <label htmlFor="etiquetas" className={styles.label}>
        Etiquetas
      </label>

      <div
        className={`${styles.tagsBox} ${
          errorTags ? styles.tagsBoxError : ""
        }`}
      >
        {tagsSeleccionados.map((tag) => (
          <span key={tag._id} className={styles.tagChip}>
            #{tag.nombre}

            <button
              type="button"
              className={styles.tagRemove}
              onClick={() => toggleTag(tag)}
              aria-label={`Quitar ${tag.nombre}`}
            >
              ×
            </button>
          </span>
        ))}

        <input
          ref={tagInputRef}
          id="etiquetas"
          type="text"
          className={styles.tagInput}
          placeholder="Escribí una etiqueta y presioná Enter..."
          value={inputEtiqueta}
          onChange={(e) => {
            setInputEtiqueta(e.target.value);
            setErrorTags("");
          }}
          onKeyDown={handleKeyDownEtiqueta}
        />
      </div>

      {errorTags && (
        <span className={styles.leyendaError}>
          {errorTags}
        </span>
      )}

      {tagsDisponibles.length > 0 && (
        <div className={styles.tagsSugeridos}>
          {tagsDisponibles
            .filter((tag) =>
              tag.nombre
                .toLowerCase()
                .includes(inputEtiqueta.trim().toLowerCase())
            )
            .map((tag) => {
              const activo = tagsSeleccionados.some(
                (seleccionada) => seleccionada._id === tag._id
              );

              return (
                <button
                  key={tag._id}
                  type="button"
                  className={`${styles.tagSugeridoBtn} ${
                    activo ? styles.tagSugeridoActivo : ""
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  #{tag.nombre}
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default PostTags;