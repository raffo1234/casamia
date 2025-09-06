"use client";

import PropertiesList from "./PropertiesList";
import { getRelatedProperties } from "@/lib/getRelatedProperties";
import { PropertyType } from "@/types/propertyType";
import { useMemo } from "react";
import useSWR from "swr"; // Import the SWR hook
import PropertiesGrid from "./PropertiesGrid";

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
    return <p>Cargando propiedades...</p>;
  }

  if (totalCount && totalCount > 0) {
    return (
      <>
        <h3 className="mb-6 text-sm text-slate-700 mt-20">
          Propiedades que también podrían interesarte:
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
      </>
    );
  }

  return null;
}
