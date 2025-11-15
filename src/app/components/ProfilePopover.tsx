import { Icon } from "@iconify/react";
import Link from "next/link";
import Image from "next/image";
import { signOut, auth } from "@/lib/auth";
import GoogleLoginButton from "./GoogleLoginButton";
import { supabase } from "@/lib/supabase";

export default async function ProfilePopover() {
  const session = await auth();
  const userEmail = session?.user?.email;

  const { data: user } = await supabase
    .from("user")
    .select("slug")
    .eq("email", userEmail)
    .single();

  const menu = [
    {
      href: "/",
      icon: "solar:home-smile-angle-broken",
      label: "Inicio",
    },
    {
      href: `/usuario/${user?.slug}`,
      icon: "solar:traffic-economy-outline",
      label: "Mis Publicaciones",
    },
    {
      href: "/favoritos",
      icon: "solar:heart-linear",
      label: "Favoritos",
    },
    {
      href: "/admin/property",
      icon: "solar:settings-minimalistic-broken",
      label: "Admin",
    },
  ];

  return session ? (
    <div className="flex items-center gap-4 relative group z-30 dropdown-parent">
      <button type="button" className="relative w-12 h-12 bg-gray-100 rounded-full">
        {session?.user?.image ? (
          <Image
            src={session.user.image}
            className="w-12 h-12 rounded-full object-cover"
            width={48}
            height={48}
            alt={session.user.image}
            priority={false}
            quality={70}
          />
        ) : null}
        <div className="w-3 h-3 absolute top-9 right-0 rounded-full bg-green-400 border-2 border-white" />
      </button>
      <div className="dropdown-child opacity-0 pt-2 transition-all duration-300 invisible translate-y-2 group-hover:translate-y-0 group-hover:visible group-hover:opacity-100 absolute top-full -right-3">
        <ul className="bg-white shadow-lg rounded-lg w-[300px] border border-gray-100">
          <li className="py-6 text-center">
            <div className="relative w-12 h-12 mb-4 mx-auto">
              {session?.user?.image && session.user.name ? (
                <Image
                  src={session.user.image}
                  className="rounded-full object-cover w-full h-full"
                  alt={session.user.name}
                  width={48}
                  height={48}
                  priority={false}
                />
              ) : null}
              <div className="w-3 h-3 absolute top-9 right-0 rounded-full bg-green-400 border-2 border-white" />
            </div>
            <p className="text-center mb-1 text-sm font-semibold w-full">{session.user?.name}</p>
            <p className="text-slate-400 text-xs">{userEmail}</p>
          </li>
          {menu.map(({ href, icon, label }) => {
            return (
              <li key={href}>
                <Link
                  href={href}
                  className="py-2 px-6 hover:bg-gray-50 flex items-center gap-3.5"
                  title={label}
                >
                  <Icon icon={icon} fontSize={20} />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
          <li className="border-t border-gray-100">
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button className="hover:text-red-500 cursor-pointer w-full px-6 py-4 flex items-center gap-3.5 text-left transition-colors">
                <Icon icon="solar:inbox-out-linear" className="-rotate-90" fontSize={20} />
                <span>Salir</span>
              </button>
            </form>
          </li>
        </ul>
      </div>
    </div>
  ) : (
    <GoogleLoginButton />
  );
}
