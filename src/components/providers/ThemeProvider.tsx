"use client";

import { ThemeProvider as NextThemesProvider } from "@teispace/next-themes";
import { themeConfig } from "@/lib/theme-config";

type ThemeProviderProps = {
  children: React.ReactNode;
  initialTheme?: string | null;
  noScript?: boolean;
};

export function ThemeProvider({
  children,
  initialTheme,
  noScript = false,
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute={themeConfig.attribute}
      defaultTheme={themeConfig.defaultTheme}
      enableSystem={themeConfig.enableSystem}
      themes={[...themeConfig.themes]}
      storageKey={themeConfig.storageKey}
      initialTheme={initialTheme ?? undefined}
      noScript={noScript}
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
