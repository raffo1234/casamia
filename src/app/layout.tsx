import localFont from "next/font/local";
import type { Metadata } from "next";
import { Bebas_Neue, Roboto } from "next/font/google";
import GlobalModal from "./components/GlobalModal";
import "./globals.css";
import Slider from "./components/Slider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";

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
  src: "../../public/fonts/Flaviotte.woff2",
  variable: "--font-flaviotte",
});

const gilroyBold = localFont({
  src: "../../public/fonts/Gilroy-Bold.woff",
  variable: "--font-gilroy-bold",
});

const gilroyMedium = localFont({
  src: "../../public/fonts/Gilroy-Medium.woff",
  variable: "--font-gilroy-medium",
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
      className={`${roboto.variable} ${bebas.variable} ${gilroyMedium.variable} ${gilroyBold.variable} font-roboto text-[#222222] ${flaviotte.variable} font-normal`}
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
        <Analytics />
      </body>
    </html>
  );
}
