import type { Metadata } from "next";
import "../globals.css";
import { auth } from "@/lib/auth";
import Aside from "@/components/Aside";
import ProfilePopover from "@/components/ProfilePopover";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "Admin Casamia",
  description: "Admin Casamia",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const user = session?.user;

  return (
    <>
      <header className="border-b border-gray-200 py-4 flex justify-between relative z-20">
        <div className="max-w-[1360px] px-4 mx-auto w-full flex justify-between items-center">
          <h1 className="block">
            <Logo />
          </h1>
          <ProfilePopover />
        </div>
      </header>
      <main className="flex items-start w-full z-10 min-h-lvh relative">
        {user && user?.name && user?.image ? (
          <Aside userName={user.name} userImage={user.image} />
        ) : null}
        <section className="bg-slate-50 flex-grow relative px-4 md:px-7 lg:px-10 py-12 lg:border-l min-h-lvh lg:border-gray-200">
          {children}
        </section>
      </main>
    </>
  );
}
