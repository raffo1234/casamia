import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Casamia",
  description: "Casamia",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body id="app">{children}</body>
    </html>
  );
}
