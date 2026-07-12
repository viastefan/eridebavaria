"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-foreground text-background hover:shadow-[0_0_40px_rgba(59,158,255,0.3)]",
  secondary:
    "border border-border bg-transparent text-foreground hover:border-foreground/20 hover:bg-white/5",
  ghost: "bg-transparent text-foreground-secondary hover:text-foreground",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", children, className = "", ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        data-cursor="pointer"
        className={`relative overflow-hidden rounded-full px-8 py-3.5 text-sm font-medium tracking-wide transition-colors duration-500 ${variants[variant]} ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        {variant === "primary" && (
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent-secondary/20"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
