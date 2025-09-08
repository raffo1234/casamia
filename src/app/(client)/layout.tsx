import "../globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import HomeContainer from "@/components/HomeContainer";

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
    <>
      <Header />
      <HomeContainer>{children}</HomeContainer>
      {modal}
      {propertyImages}
      {typologyImages}
    </>
  );
}
