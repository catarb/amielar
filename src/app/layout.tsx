import type { Metadata } from "next";
import { EB_Garamond, Montserrat } from "next/font/google";

import { RouteAnchorRestorer } from "@/components/RouteAnchorRestorer";

import "./globals.css";

const garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
});

const siteDescription =
  "Experiencias de bienestar y conexión con la naturaleza a través del mundo de las abejas, en Arata, La Pampa.";

export const metadata: Metadata = {
  metadataBase: new URL("https://amielarargentina.com"),
  title: "AMIELAR",
  description: siteDescription,
  alternates: {
    canonical: "https://amielarargentina.com",
  },
  openGraph: {
    title: "AMIELAR",
    description: siteDescription,
    url: "https://amielarargentina.com",
  },
  twitter: {
    title: "AMIELAR",
    description: siteDescription,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${garamond.variable} ${montserrat.variable}`}>
        <RouteAnchorRestorer />
        {children}
      </body>
    </html>
  );
}
