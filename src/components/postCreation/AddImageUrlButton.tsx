import { Button } from "../../components/botonGenerico/Button";

interface AddImageUrlButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export const AddImageUrlButton = ({ onClick, disabled }: AddImageUrlButtonProps) => {
  return (
    <Button variant="secundario" onClick={onClick} disabled={disabled}>
      + Agregar URL
    </Button>
  );
};

export default AddImageUrlButton;