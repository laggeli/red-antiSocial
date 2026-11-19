import { Folder2Open } from "react-bootstrap-icons";
import { ButtonIcon } from "../../components/botonGenerico/ButtonIcon";
import type { AddImageButtonProps } from "../../types/PostTypes";

export const AddSelectImageButton = ({ onClick, disabled }: AddImageButtonProps) => {
  return (
    <ButtonIcon 
      variant="secundario" 
      icon={<Folder2Open size={16} />} 
      onClick={onClick} 
      disabled={disabled}
    >
      Seleccionar desde la computadora
    </ButtonIcon>
  );
};

export default AddSelectImageButton;