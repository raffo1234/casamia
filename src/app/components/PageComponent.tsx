import { useEffect } from "react";
import useSWR from "swr";
import { PropertyType } from "@/types/propertyType";
import PropertyCard from "./PropertyCard";

export default function PageComponent({
  page,
  pageSize,
  userEmail,
  setIsLoadingMore,
  fetcherPage,
  swrKeyPage,
}: {
  page: number;
  pageSize: number;
  setIsLoadingMore: (value: boolean) => void;
  userEmail: string | undefined | null;
  fetcherPage: (
    index: number,
    pageSize: number
  ) => Promise<PropertyType[] | null>;
  swrKeyPage: string;
}) {
  const { data: properties, isLoading } = useSWR(
    `${swrKeyPage}-${page}`,
    async () => await fetcherPage(page, pageSize)
  );

  useEffect(() => {
    setIsLoadingMore(isLoading);
  }, [properties?.length, isLoading, setIsLoadingMore]);

  return properties?.map((property) => (
    <PropertyCard key={property.id} userEmail={userEmail} property={property} />
  ));
}
