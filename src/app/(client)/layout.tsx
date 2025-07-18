import type { Metadata } from "next";
import Main from "@/components/Main";
import "../globals.css";
import Header from "@/components/Header";
import PropertyPreview from "@/components/PropertyPreview";
import { auth } from "@/lib/auth";
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
  const session = await auth();
  const userEmail = session?.user?.email;

  return (
    <>
      <Header />
      <Main>{children}</Main>
      <PropertyPreview userEmail={userEmail} currentHref="/" />
    </>
  );
}
