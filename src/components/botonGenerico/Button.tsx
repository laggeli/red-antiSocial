import type { ButtonHTMLAttributes, ReactNode } from "react";
import { NavLink } from "react-router-dom";
import stylesBtn from "./Button.module.css";

export type ButtonVariant = "primario" | "secundario" | "cancelar";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  fullMobile?: boolean;
  to?: string; // Si recibe 'to', se comporta como NavLink
}

export const Button = ({
  children,
  variant = "primario",
  fullMobile = false,
  to,
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
      <NavLink to={to} className={combinedClasses}>
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