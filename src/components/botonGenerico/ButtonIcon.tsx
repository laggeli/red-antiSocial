import Button from "./Button";
import type { ButtonIconProps } from "../../types/ButtonTypes";
import stylesBtn from "./Button.module.css";

export const ButtonIcon = ({
  icon,
  children,
  iconPosition = "left",
  className = "",
  ...props
}: ButtonIconProps) => {
  const soloIcono = !children;

  return (
    <Button 
      className={`${soloIcono ? stylesBtn.btnSoloIcono : ""} ${className}`.trim()}
      {...props}
    >
      {iconPosition === "left" && icon}
      {children && <span>{children}</span>}
      {iconPosition === "right" && icon}
    </Button>
  );
};

export default ButtonIcon;