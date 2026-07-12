import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "eRide Bavaria — Elektromobilität neu definiert",
    template: "%s | eRide Bavaria",
  },
  description:
    "Premium E-Fahrzeuge für Europa. Chopper, Quads, Kleinwagen, Transporter — kuratiert und persönlich beraten.",
  metadataBase: new URL("https://eridebavaria.com"),
  openGraph: {
    title: "eRide Bavaria — Jenseits der Straße",
    description:
      "Premium E-Fahrzeuge für Europa. Chopper, Quads, Kleinwagen, Transporter — kuratiert und persönlich beraten.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
