import type { Metadata } from "next";
import Main from "./components/Main";
import "./globals.css";

export const metadata: Metadata = {
  title: "Casamina",
  description: "Casamia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body id="app">
        <Main>{children}</Main>
      </body>
    </html>
  );
}
