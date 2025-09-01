"use client";

import TypologiesGrid from "./TypologiesGrid";
import { useTypologies } from "@/hooks/useTypologies";
import TypologyCard from "./TypologyCard";

export default function Typologies({propertyId }: { propertyId: string }) {
  const {
    typologies,
    uniqueBedroomCounts,
    selectedBedroomCount,
    setSelectedBedroomCount,
    isLoading,
  } = useTypologies(propertyId);

  return (
    <div className="mt-20 md:mt-30 pb-10">
      <h3 className="mb-6 text-sm text-slate-700">
        Encuentra tu modelo ideal:
      </h3>
      <nav className="my-6 flex gap-2 items-center flex-wrap">
        {uniqueBedroomCounts.map((count) => (
          <button
            key={count}
            onClick={() => setSelectedBedroomCount(count)}
            className={`${selectedBedroomCount === count ? "bg-slate-200/50" : ""} cursor-pointer px-5 rounded-full py-3 font-semibold text-sm`}
          >
            {count} {count === 1 ? "Dormitorio" : "Dormitorios"}
          </button>
        ))}
      </nav>
      <TypologiesGrid>
        {typologies.length === 0 || isLoading ? (
          <div className="rounded-3xl animate-pulse bg-slate-200 h-[400px]" />
        ) : (
          typologies.map((typology) => (
            <TypologyCard key={typology.id} typology={typology} />
          ))
        )}
      </TypologiesGrid>
    </div>
  );
}
