import { Button } from "../../components/botonGenerico/Button";

interface CreatePostButtonProps {
  enviando: boolean;
}

export const CreatePostButton = ({ enviando }: CreatePostButtonProps) => {
  return (
    <Button type="submit" variant="primario" disabled={enviando}>
      {enviando ? "Publicando..." : "Publicar"}
    </Button>
  );
};