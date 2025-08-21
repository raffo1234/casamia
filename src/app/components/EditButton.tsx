import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

export default function EditLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="rounded-full w-11 h-11 hover:bg-slate-100 border-slate-100 transition-colors duration-300 border flex items-center justify-center"
    >
      <Icon icon="solar:clapperboard-edit-broken" fontSize={24} />
    </Link>
  );
}
