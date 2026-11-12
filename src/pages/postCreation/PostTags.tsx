import { useState, useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";
import styles from "./Posts.module.css";

const API_URL = "http://localhost:3001";

export interface TagItem {
  id: number;
  name: string;
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
  const [inputEtiqueta, setInputEtiqueta] = useState<string>("");
  const [errorTags, setErrorTags] = useState<string>("");

  // Se obtiene por GET /tags el listado de etiquetas disponibles
  useEffect(() => {
    const cargarTags = async () => {
      try {
        const res = await fetch(`${API_URL}/tags`);
        if (res.ok) {
          const data: TagItem[] = await res.json();
          setTagsDisponibles(data);
        }
      } catch (err) {
        console.error("Error al cargar etiquetas:", err);
      }
    };
    cargarTags();
  }, []);

  const enfocarInputTags = () => {
    tagInputRef.current?.focus();
  };

  const seleccionarTagPorNombre = (nombreRaw: string) => {
    const limpia = nombreRaw.trim().replace(/^#/, "").toLowerCase();
    if (!limpia) return;

    const encontrada = tagsDisponibles.find(
      (t) => t.name.toLowerCase() === limpia
    );

    if (!encontrada) {
      setErrorTags(
        `La etiqueta "#${limpia}" inexistente en el listado disponible. Debes elegir una de las opciones que se muestran debajo.`
      );
      enfocarInputTags();
      return;
    }

    if (tagsSeleccionados.some((t) => t.id === encontrada.id)) {
      setErrorTags(`La etiqueta "#${encontrada.name}" ya fue agregada.`);
      enfocarInputTags();
      return;
    }

    setErrorTags("");
    onChangeTags([...tagsSeleccionados, encontrada]);
    setInputEtiqueta("");
  };

  const handleKeyDownEtiqueta = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      seleccionarTagPorNombre(inputEtiqueta);
    } else if (
      e.key === "Backspace" &&
      !inputEtiqueta &&
      tagsSeleccionados.length > 0
    ) {
      onChangeTags(tagsSeleccionados.slice(0, -1));
      if (errorTags) setErrorTags("");
    }
  };

  const toggleTag = (tag: TagItem) => {
    setErrorTags("");
    const existe = tagsSeleccionados.some((t) => t.id === tag.id);
    if (existe) {
      onChangeTags(tagsSeleccionados.filter((t) => t.id !== tag.id));
    } else {
      onChangeTags([...tagsSeleccionados, tag]);
    }
  };

  const eliminarEtiqueta = (id: number) => {
    onChangeTags(tagsSeleccionados.filter((t) => t.id !== id));
    if (errorTags) setErrorTags("");
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
          <span key={tag.id} className={styles.tagChip}>
            #{tag.name}
            <button
              type="button"
              className={styles.tagRemove}
              onClick={() => eliminarEtiqueta(tag.id)}
              aria-label={`Quitar etiqueta ${tag.name}`}
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
          placeholder="Para buscar una etiqueta, escriba el nombre y haga Enter..."
          value={inputEtiqueta}
          onChange={(e) => {
            setInputEtiqueta(e.target.value);
            if (errorTags) setErrorTags("");
          }}
          onKeyDown={handleKeyDownEtiqueta}
        />
      </div>
      {/* Leyenda de error debajo del contenedor de tags */}
      {errorTags && <span className={styles.leyendaError}>{errorTags}</span>}

      {/* Etiquetas obtenidas de GET /tags */}
      {tagsDisponibles.length > 0 && (
        <div className={styles.tagsSugeridos}>
          {tagsDisponibles
            .filter((t) =>
              t.name.toLowerCase().includes(inputEtiqueta.trim().toLowerCase())
            )
            .map((tag) => {
              const activo = tagsSeleccionados.some((t) => t.id === tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  className={`${styles.tagSugeridoBtn} ${
                    activo ? styles.tagSugeridoActivo : ""
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  #{tag.name}
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default PostTags;