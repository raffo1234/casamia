"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Property from "./Property";
import Main from "./Main";
import { PropertyType } from "@/types/propertyType";

export default function PropertyPreview({
  property,
  userEmail,
}: {
  property: PropertyType;
  userEmail: string | undefined | null;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        router.back();
      }
    },
    [router],
  );

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          router.back();
        }
      }}
      onClick={handleOverlayClick}
      className="fixed top-0 left-0 z-30 w-full h-full overflow-auto transition-all duration-200 cursor-pointer bg-black/60 lg:p-6 bg-opacity-40"
    >
      <div className="animate-fade-in pb-20 cursor-default mx-auto relative lg:rounded-xl bg-white min-h-lvh">
        <Main>
          <Property property={property} userEmail={userEmail} />
        </Main>
      </div>
      <button
        type="button"
        className="absolute bg-yellow-400 cursor-pointer p-3 transition-colors duration-300 rounded-full right-3 top-3 hover:bg-yellow-500"
        onClick={router.back}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 512 512">
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32"
            d="M368 368L144 144m224 0L144 368"
          />
        </svg>
      </button>
    </div>
  );
}
