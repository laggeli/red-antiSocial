import Button from "./Button";
import type { ButtonIconProps } from "../../types/ButtonTypes";

export const ButtonIcon = ({
  icon,
  children,
  iconPosition = "left",
  className = "",
  ...props
}: ButtonIconProps) => {
  return (
    <Button className={className} {...props}>
      {iconPosition === "left" && icon}
      {children && <span>{children}</span>}
      {iconPosition === "right" && icon}
    </Button>
  );
};

export default ButtonIcon;