import Link from "next/link";

export default function BackLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="p-3 bg-slate-100 rounded-full transition-colors hover:bg-slate-200 active:bg-slate-300 flex items-center justify-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="19 12 5 12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
      <span className="sr-only">Volver</span>
    </Link>
  );
}
