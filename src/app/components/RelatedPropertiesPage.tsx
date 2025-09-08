"use client";

import PropertiesList from "./PropertiesList";
import { getRelatedProperties } from "@/lib/getRelatedProperties";
import { PropertyType } from "@/types/propertyType";
import { useMemo } from "react";
import useSWR from "swr"; // Import the SWR hook
import PropertiesGrid from "./PropertiesGrid";
import TypologiesGrid from "./TypologiesGrid";

const totalCountFetcher = async ([_key, propertyId]: [
  string,
  string,
]): Promise<number> => {
  const allRelatedProperties = await getRelatedProperties(propertyId);
  return allRelatedProperties?.length || 0;
};

export default function RelatedPropertiesPage({
  userEmail,
  propertyId,
}: {
  userEmail: string | undefined | null;
  propertyId: string;
}) {
  const initPage = 0;

  const fetcherPage = async (
    index: number,
    pageSize: number
  ): Promise<PropertyType[] | null> => {
    const allRelatedProperties = await getRelatedProperties(propertyId);
    if (!allRelatedProperties) return null;

    const start = index * pageSize;
    const end = start + pageSize;
    return allRelatedProperties.slice(start, end);
  };

  const fetcherTotal = async (): Promise<number> => {
    const allRelatedProperties = await getRelatedProperties(propertyId);
    return allRelatedProperties?.length || 0;
  };

  const swrKeyPage = useMemo(
    () => `related-properties-page-${propertyId}`,
    [propertyId]
  );
  const swrKeyTotal = useMemo(
    () => `related-properties-total-${propertyId}`,
    [propertyId]
  );

  const { data: totalCount, isLoading } = useSWR(
    swrKeyTotal,
    () => totalCountFetcher([swrKeyTotal, propertyId]),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (isLoading) {
    return (
      <TypologiesGrid>
        <div className="rounded-3xl animate-pulse bg-slate-100 h-[400px]" />
        <div className="rounded-3xl animate-pulse bg-slate-100 h-[400px]" />
        <div className="rounded-3xl animate-pulse bg-slate-100 h-[400px]" />
      </TypologiesGrid>
    );
  }

  if (totalCount && totalCount > 0) {
    return (
      <div className="mt-20 pt-20 border-t-2 border-slate-200">
        <h3 className="mb-6 text-slate-800 font-semibold">
          También podría interesarte
        </h3>
        <br />
        <PropertiesGrid>
          <PropertiesList
            userEmail={userEmail}
            swrKeyPage={swrKeyPage}
            swrKeyTotal={swrKeyTotal}
            fetcherPage={fetcherPage}
            fetcherTotal={fetcherTotal}
            initPage={initPage}
          />
        </PropertiesGrid>
      </div>
    );
  }

  return null;
}
