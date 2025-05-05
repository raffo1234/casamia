import type { Metadata } from "next";
import Main from "@/components/Main";
import "../globals.css";
import Header from "@/components/Header";
import PropertyPreview from "@/components/PropertyPreview";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin Casamia",
  description: "Admin Casamia",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const userEmail = session?.user?.email;

  return (
    <html lang="es">
      <body id="admin">
        <Header />
        <Main>{children}</Main>
        <PropertyPreview userEmail={userEmail} currentHref="/" />
      </body>
    </html>
  );
}
