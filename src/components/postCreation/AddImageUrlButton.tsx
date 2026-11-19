import { PlusLg } from "react-bootstrap-icons";
import { ButtonIcon } from "../../components/botonGenerico/ButtonIcon";

interface AddImageUrlButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export const AddImageUrlButton = ({ onClick, disabled }: AddImageUrlButtonProps) => {
  return (
    <ButtonIcon 
      variant="secundario" 
      icon={<PlusLg size={15} />} 
      onClick={onClick} 
      disabled={disabled}>
        Agregar URL
    </ButtonIcon>
  );
};

export default AddImageUrlButton;