import "../globals.css";
import type { Metadata } from "next";
import Main from "@/components/Main";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Casamia",
  description: "Casamia",
};

export default async function ClientLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <Main>{children}</Main>
      {modal}
    </>
  );
}
