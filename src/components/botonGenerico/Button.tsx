import { NavLink } from "react-router-dom";
import type { ButtonProps } from "../../types/ButtonTypes";
import stylesBtn from "./Button.module.css";

export const Button = ({
  children,
  variant = "primario",
  fullMobile = false,
  to,
  state,
  className = "",
  type = "button",
  ...props
}: ButtonProps) => {
  const variantClass = {
    primario: stylesBtn.btnPrimario,
    secundario: stylesBtn.btnSecundario,
    cancelar: stylesBtn.btnCancelar,
  }[variant];

  const combinedClasses = [
    variantClass,
    fullMobile ? stylesBtn.btnFullMobile : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (to) {
    return (
      <NavLink to={to} state={state} className={combinedClasses}>
        {children}
      </NavLink>
    );
  }

  return (
    <button type={type} className={combinedClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;