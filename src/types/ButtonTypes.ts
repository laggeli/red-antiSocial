import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primario" | "secundario" | "cancelar";

export type IconPosition = "left" | "right";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  fullMobile?: boolean;
  to?: string; // Si recibe 'to', se comporta como NavLink
  state?: unknown; //Si recibe state sabe desde qué página vino el usuario y al presionar Volver puede redirreccionarlo a esa
}

export interface ButtonIconProps extends Omit<ButtonProps, "children"> {
  icon: ReactNode;
  children?: ReactNode; // Opcional por si querés un botón de solo ícono
  iconPosition?: IconPosition;
}
/*
Omit<ButtonProps, "children"> se usa para volver a declarar como opcional (children?: ReactNode) y que sea un boton de un ícono
*/