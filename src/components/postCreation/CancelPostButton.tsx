import { Button } from "../../components/botonGenerico/Button";

interface CancelPostButtonProps {
  enviando: boolean;
  onCancel: () => void;
}

export const CancelPostButton = ({ enviando, onCancel }: CancelPostButtonProps) => {
  return (
    <Button
      type="button"
      variant="cancelar"
      onClick={onCancel}
      disabled={enviando}
    >
      Cancelar
    </Button>
  );
};