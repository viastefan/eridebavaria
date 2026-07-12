"use client";

import { forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: "btn btn--primary",
  secondary: "btn btn--secondary",
  ghost: "btn btn--ghost",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", children, className = "", ...props }, ref) => {
    return (
      <button ref={ref} className={`${variants[variant]} ${className}`} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
