import styles from "./Posts.module.css";
import type { PostTagOptionsListProps } from "../../types/PostTypes";

export const PostTagOptionsList = ({
  tagsDisponibles,
  tagsSeleccionados,
  busqueda,
  onToggleTag,
}: PostTagOptionsListProps) => {
  const filtrados = tagsDisponibles.filter((tag) =>
    tag.nombre.toLowerCase().includes(busqueda.trim().toLowerCase())
  );

  if (filtrados.length === 0) return null;

  return (
    <div className={styles.tagsSugeridos}>
      {filtrados.map((tag) => {
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
            onClick={() => onToggleTag(tag)}
          >
            #{tag.nombre}
          </button>
        );
      })}
    </div>
  );
};

export default PostTagOptionsList;