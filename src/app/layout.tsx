import localFont from "next/font/local";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import GlobalModal from "./components/GlobalModal";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-manrope",
});

const flaviotte = localFont({
  src: "../../public/fonts/Flaviotte.woff2", // The path to your local font file
  variable: "--font-flaviotte",
});

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
    <html
      lang="es"
      className={`${roboto.variable} font-roboto text-[#222222] ${flaviotte.variable} font-normal`}
    >
      <body id="app">
        {children}
        <GlobalModal />
      </body>
    </html>
  );
}
