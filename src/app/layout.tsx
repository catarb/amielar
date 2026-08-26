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

export const metadata: Metadata = {
  title: "AMIELAR",
  description:
    "Frontend conceptual para AMIELAR, experiencia de api-inhalacion, apiturismo y productos de la colmena en La Pampa.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
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
