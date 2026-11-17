import { Button } from "../botonGenerico/Button";
import type { AddImageButtonProps } from "../../types/PostTypes";

export const AddSelectImageButton = ({ onClick, disabled }: AddImageButtonProps) => {
  return (
    <Button
      type="button"
      variant="secundario"
      onClick={onClick}
      disabled={disabled}
    >
      <span>📁</span> Seleccionar desde la computadora
    </Button>
  );
};

export default AddSelectImageButton;