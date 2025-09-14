"use client";

import TypologiesGrid from "./TypologiesGrid";
import { useTypologies } from "@/hooks/useTypologies";
import TypologyCard from "./TypologyCard";
import { Suspense } from "react";
import H3 from "./H3";

export default function Typologies({ propertyId }: { propertyId: string }) {
  const {
    typologies,
    uniqueBedroomCounts,
    selectedBedroomCount,
    setSelectedBedroomCount,
    isLoading,
  } = useTypologies(propertyId);

  if (isLoading)
    return (
      <div className="mt-20 md:mt-30">
        <H3>Encuentra tu modelo ideal</H3>
        <div className="my-6 flex gap-2 items-center flex-wrap">
          <div className="rounded-full animate-pulse bg-slate-100 h-11 w-[125px]"></div>
          <div className="rounded-full animate-pulse bg-slate-100 h-11 w-[125px]"></div>
          <div className="rounded-full animate-pulse bg-slate-100 h-11 w-[125px]"></div>
        </div>
        <TypologiesGrid>
          <div className="rounded-3xl animate-pulse bg-slate-100 h-[275px]" />
          <div className="rounded-3xl animate-pulse bg-slate-100 h-[275px]" />
          <div className="rounded-3xl animate-pulse bg-slate-100 h-[275px]" />
        </TypologiesGrid>
      </div>
    );

  return (
    <div className={`${typologies.length > 0 ? "mt-20 md:mt-30" : ""}`}>
      {isLoading ? <div></div> : <H3>Encuentra tu modelo ideal</H3>}
      <nav className="my-6 flex gap-2 items-center flex-wrap">
        {uniqueBedroomCounts.map((count) => (
          <button
            key={count}
            onClick={() => setSelectedBedroomCount(count)}
            className={`${
              selectedBedroomCount === count ? "bg-slate-200/50" : ""
            } cursor-pointer px-5 rounded-full py-3 font-semibold text-sm`}
          >
            {count} {count === 1 ? "Dormitorio" : "Dormitorios"}
          </button>
        ))}
      </nav>
      <TypologiesGrid>
        <Suspense>
          {typologies.map((typology) => (
            <TypologyCard key={typology.id} typology={typology} />
          ))}
        </Suspense>
      </TypologiesGrid>
    </div>
  );
}
