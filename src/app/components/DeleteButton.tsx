import { Icon } from "@iconify/react/dist/iconify.js";

function Spinner() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path
          strokeDasharray="16"
          strokeDashoffset="16"
          d="M12 3c4.97 0 9 4.03 9 9"
        >
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            dur="0.3s"
            values="16;0"
          />
          <animateTransform
            attributeName="transform"
            dur="1.5s"
            repeatCount="indefinite"
            type="rotate"
            values="0 12 12;360 12 12"
          />
        </path>
        <path
          strokeDasharray="64"
          strokeDashoffset="64"
          strokeOpacity="0.3"
          d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"
        >
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            dur="1.2s"
            values="64;0"
          />
        </path>
      </g>
    </svg>
  );
}

export default function DeleteButton({
  onClick,
  isDeleting = false,
}: {
  onClick: () => void;
  isDeleting?: boolean;
}) {
  return (
    <button
      disabled={isDeleting}
      onClick={onClick}
      type="button"
      className="cursor-pointer relative w-11 h-11 rounded-full border-gray-100 border text-red-500 flex items-center justify-center"
    >
      <Icon
        className={`${isDeleting ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        icon="solar:trash-bin-minimalistic-broken"
        fontSize={24}
      />
      <div
        className={`${isDeleting ? "opacity-100" : "opacity-0"} transition-opacity duration-300 absolute left-1/2 -translate-1/2 top-1/2`}
      >
        <Spinner />
      </div>
    </button>
  );
}
