"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@teispace/next-themes";
import { Moon, Sun } from "lucide-react";
import { labels } from "@/lib/labels";

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type ThemeToggleProps = {
  className?: string;
  variant?: "icon" | "footer";
};

export function ThemeToggle({ className, variant = "icon" }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <span
        className={cn(variant === "footer" ? "inline-block h-4 w-16" : className, "inline-block")}
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme !== "light";
  const label = isDark ? labels.lightMode : labels.darkMode;

  if (variant === "footer") {
    return (
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={cn(
          "inline-flex items-center gap-1.5 text-xs text-foreground-secondary transition-colors hover:text-foreground",
          className
        )}
        aria-label={label}
      >
        {isDark ? (
          <Sun className="h-3 w-3" strokeWidth={1.5} />
        ) : (
          <Moon className="h-3 w-3" strokeWidth={1.5} />
        )}
        <span>{isDark ? "Hellmodus" : "Dunkelmodus"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        className ??
          "rounded-full p-2.5 text-foreground-secondary transition-colors hover:bg-foreground/5 hover:text-foreground"
      )}
      aria-label={label}
    >
      {isDark ? (
        <Sun className="h-4 w-4" strokeWidth={1.5} />
      ) : (
        <Moon className="h-4 w-4" strokeWidth={1.5} />
      )}
    </button>
  );
}
