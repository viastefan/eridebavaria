import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { getTheme, getThemeScript } from "@teispace/next-themes/server";
import { AppShell } from "@/components/layout/AppShell";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { themeConfig } from "@/lib/theme-config";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "eRide Bavaria — E-Fahrzeuge & Service Simbach",
    template: "%s | eRide Bavaria",
  },
  description:
    "Premium E-Mobilität mit persönlicher Beratung, Werkstatt und Ersatzteilen — Ihr Partner in Simbach am Inn und der Inn-Salzach-Region.",
  metadataBase: new URL("https://eridebavaria.com"),
  openGraph: {
    title: "eRide Bavaria — E-Fahrzeuge & Service in Simbach am Inn",
    description:
      "Quads, Mopedautos, Transporter und mehr — mit Werkstatt, Ersatzteilen und persönlicher Beratung in der Inn-Salzach-Region.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialTheme = await getTheme({ themes: [...themeConfig.themes] });
  const themeScript = getThemeScript({
    attribute: themeConfig.attribute,
    themes: [...themeConfig.themes],
    defaultTheme: themeConfig.defaultTheme,
    enableSystem: themeConfig.enableSystem,
    initialTheme: initialTheme ?? undefined,
  });

  const themeClass =
    initialTheme === "dark" || initialTheme === "light" ? initialTheme : themeConfig.defaultTheme;

  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full ${themeClass}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        <ThemeProvider initialTheme={initialTheme} noScript>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
