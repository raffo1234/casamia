import Spinner from "./Spinner";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: React.ReactNode;
  isLoading?: boolean;
}

export default function PrimaryButton({
  label,
  isLoading = false,
  ...props
}: Props) {
  return (
    <button
      disabled={isLoading}
      className="relative animate-opacity text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
      {...props}
    >
      <span className={`${isLoading ? "opacity-0" : "opacity-100"}`}>
        {label}
      </span>
      <span
        className={`${isLoading ? "opacity-100" : "opacity-0"} text-slate-300 absolute flex justify-center items-center left-0 top-0 w-full h-full`}
      >
        <Spinner />
      </span>
    </button>
  );
}
