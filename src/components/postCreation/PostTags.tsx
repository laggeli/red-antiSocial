
import { useState, useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";
import styles from "./Posts.module.css";
import { API_URL } from "../../config/api";
import type { TagItem, PostTagsProps } from "../../types/PostTypes";
import { PostTagInput } from "./PostTagInput";
import { PostTagOptionsList } from "./PostTagOptionsList";

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

      <PostTagInput
        tagsSeleccionados={tagsSeleccionados}
        inputEtiqueta={inputEtiqueta}
        onInputChange={(val) => {
          setInputEtiqueta(val);
          setErrorTags("");
        }}
        onKeyDown={handleKeyDownEtiqueta}
        onToggleTag={toggleTag}
        hasError={Boolean(errorTags)}
        inputRef={tagInputRef}
      />

      {errorTags && (
        <span className={styles.leyendaError}>
          {errorTags}
        </span>
      )}

      <PostTagOptionsList
        tagsDisponibles={tagsDisponibles}
        tagsSeleccionados={tagsSeleccionados}
        busqueda={inputEtiqueta}
        onToggleTag={toggleTag}
      />
    </div>
  );
};

export default PostTags;