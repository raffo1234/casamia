import localFont from "next/font/local";
import type { Metadata } from "next";
import { Inter_Tight, Roboto } from "next/font/google";
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

const interTight = Inter_Tight({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-inter-tight",
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
      className={`${roboto.variable} ${interTight.variable} ${gilroyMedium.variable} ${gilroyBold.variable} font-roboto text-[#222222] ${flaviotte.variable} font-normal min-h-lvh`}
    >
      <body
        id="app"
        style={{
          backgroundImage: `
    radial-gradient(circle at 20% 15%, #fbe8c6, transparent 25%),
    radial-gradient(circle at 50% 10%, #feebff, transparent 30%),
    radial-gradient(circle at 80% 15%, rgba(197, 235, 150, 0.35), transparent 35%),
    radial-gradient(circle at 25% 30%, rgba(255, 255, 255, 0.70), transparent 50%),
    radial-gradient(circle at 60% 25%, rgba(255, 255, 255, 0.75), transparent 50%),
    linear-gradient(to bottom, #fbe8c6 0%, #feebff 10%, white 100%)
  `,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top center",
        }}
      >
        <Toaster
          toastOptions={{
            className: "text-xs",
            duration: 3500,
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
