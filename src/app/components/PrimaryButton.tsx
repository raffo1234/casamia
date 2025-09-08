import Link from "next/link";
import Spinner from "./Spinner";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  isLoading?: boolean;
  href?: string;
  isFullWidth?: boolean;
}

export default function PrimaryButton({
  title,
  isLoading = false,
  href,
  isFullWidth = false,
  ...props
}: Props) {
  const className = `${isFullWidth ? "w-full" : "w-fit"} relative animate-opacity text-base text-white bg-slate-900 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-slate-300 rounded-full px-6 py-3.5 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700`;

  return href ? (
    <Link href={href} className={className}>
      {title}
    </Link>
  ) : (
    <button disabled={isLoading} className={className} {...props}>
      <span className={`${isLoading ? "opacity-0" : "opacity-100"}`}>
        {title}
      </span>
      <span
        className={`${isLoading ? "opacity-100" : "opacity-0"} text-slate-300 absolute flex justify-center items-center left-0 top-0 w-full h-full`}
      >
        <Spinner />
      </span>
    </button>
  );
}
