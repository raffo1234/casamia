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
      style={{
        background: `
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' fill='white' opacity='0.8'/%3E%3C/svg%3E"),
    radial-gradient(circle at 83.9779% 17.3014%, #fef8d7, transparent 49%),
    radial-gradient(circle at 24.6547% 22.7421%, #fbe8c6, transparent 24%),
    radial-gradient(circle at 79.1436% 74.3199%, #ffffff, transparent 55%),
    radial-gradient(circle at 55.663% 26.333%, #feebff, transparent 60%),
    radial-gradient(circle at 22.8591% 75.6257%, #ffffff, transparent 60%),
    radial-gradient(circle at 52.6934% 76.2786%, #ffffff, transparent 60%),
    radial-gradient(circle at 83.011% 5.5495%, #1fad36, transparent 22%),
    radial-gradient(circle at 54.6271% 4.2437%, #e2ca50, transparent 100%),
    radial-gradient(circle at 19.8204% 5.6583%, #fbc16a, transparent 100%),
    linear-gradient(0deg, #fef8d7, #fbe8c6, #ffffff, #feebff, #ffffff, #ffffff, #1fad36, #e2ca50, #fbc16a)
  `,
        backgroundBlendMode:
          "overlay, normal, normal, normal, normal, normal, normal, normal, normal, normal",
      }}
    >
      <body id="app">
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
