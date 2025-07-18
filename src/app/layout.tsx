import type { Metadata } from "next";
import "./globals.css";
import GlobalModal from "@/components/GlobalModal";

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
      <body id="app">
        {children}
        <GlobalModal />
      </body>
    </html>
  );
}
