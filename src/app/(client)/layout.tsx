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
  propertyImages,
  typologyImages,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
  propertyImages: React.ReactNode;
  typologyImages: React.ReactNode;
}>) {
  return (
    <div className="bg-slate-50 min-h-lvh">
      <Header />
      <Main>{children}</Main>
      {modal}
      {propertyImages}
      {typologyImages}
    </div>
  );
}
