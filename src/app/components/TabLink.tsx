import Link from "next/link";

export default function TabLink({
  href,
  title,
}: {
  href: string;
  title: string;
}) {
  return (
    <Link
      href={href}
      title={title}
      className="font-gilroy-medium text-xl py-3 px-5 bg-slate-100 hover:bg-slate-200 transition-colors duration-300 rounded-2xl"
    >
      {title}
    </Link>
  );
}
