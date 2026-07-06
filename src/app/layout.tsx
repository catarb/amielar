import type { Metadata } from "next";
import { EB_Garamond, Montserrat } from "next/font/google";

import "./globals.css";

const garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
  weight: ["500", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AMIELAR | Bienestar rural en Arata",
  description:
    "Frontend conceptual para AMIELAR, experiencia de api-inhalacion, apiturismo y productos de la colmena en La Pampa.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/apple-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${garamond.variable} ${montserrat.variable}`}>{children}</body>
    </html>
  );
}
