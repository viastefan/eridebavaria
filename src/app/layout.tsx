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
    default: "eRide Bavaria — Electric Mobility Reimagined",
    template: "%s | eRide Bavaria",
  },
  description:
    "Premium European electric mobility. Cinematic product experience. Engineered in Bavaria.",
  metadataBase: new URL("https://eridebavaria.com"),
  openGraph: {
    title: "eRide Bavaria — Move Beyond Roads",
    description:
      "Premium European electric vehicles. Experience movement without compromise.",
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
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
