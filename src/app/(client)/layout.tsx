import type { Metadata } from "next";
import Main from "@/components/Main";
import "../globals.css";
import Header from "@/components/Header";
import PropertyPreview from "@/components/PropertyPreview";
import { auth } from "@/lib/auth";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Casamia",
  description: "Casamia",
};

export default async function ClientLayout({
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
      <Suspense>
        <PropertyPreview userEmail={userEmail} />
      </Suspense>
    </>
  );
}
