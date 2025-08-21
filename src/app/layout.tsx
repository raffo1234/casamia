import localFont from "next/font/local";
import type { Metadata } from "next";
import { Bebas_Neue, Roboto } from "next/font/google";
import GlobalModal from "./components/GlobalModal";
import "./globals.css";
import Slider from "./components/Slider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "react-hot-toast";

const roboto = Roboto({
  weight: ["300", "400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const bebas = Bebas_Neue({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-bebas",
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
      className={`${roboto.variable} ${bebas.variable} font-roboto text-[#222222] ${flaviotte.variable} font-normal`}
    >
      <body id="app">
        <Toaster
          toastOptions={{
            className: "text-xs",
          }}
        />
        <NuqsAdapter>
          {children}
          <GlobalModal />
          <Slider />
        </NuqsAdapter>
      </body>
    </html>
  );
}
