import Link from "next/link";

export default function TabLink({
  href,
  title,
  isActive,
}: {
  href: string;
  title: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      title={title}
      className={`${isActive ? "bg-cyan-100 hover:bg-cyan-200" : "bg-slate-100 hover:bg-slate-200"} font-gilroy-medium text-xl py-3 px-5   transition-colors duration-300 rounded-2xl`}
    >
      {title}
    </Link>
  );
}
