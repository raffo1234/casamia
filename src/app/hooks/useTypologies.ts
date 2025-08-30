import { useState, useEffect } from "react";
import useSWR from "swr";
import { supabase } from "@/lib/supabase";

// A fetcher for unique bedroom counts
const fetchUniqueBedroomCounts = async (propertyId: string) => {
  const { data, error } = await supabase
    .from("typology")
    .select("bedroom_count")
    .eq("property_id", propertyId);

  if (error) throw error;

  const uniqueBedrooms = new Set(data.map((item) => item.bedroom_count));
  return Array.from(uniqueBedrooms).sort((a, b) => a - b);
};

// A fetcher for filtered typologies
const fetchTypologies = async (
  propertyId: string,
  bedroomCount: number | null
) => {
  let query = supabase
    .from("typology")
    .select("*, typology_image(id, image_url)")
    .eq("property_id", propertyId)
    .order("created_at", { ascending: true });

  if (bedroomCount !== null) {
    query = query.eq("bedroom_count", bedroomCount);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const useTypologies = (propertyId: string) => {
  const { data: uniqueBedroomCounts = [] } = useSWR(
    `${propertyId}-uniqueBedroomCounts`,
    () => fetchUniqueBedroomCounts(propertyId)
  );

  const [selectedBedroomCount, setSelectedBedroomCount] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (uniqueBedroomCounts.length > 0 && selectedBedroomCount === null) {
      setSelectedBedroomCount(uniqueBedroomCounts[0]);
    }
  }, [uniqueBedroomCounts, selectedBedroomCount]);

  const { data: typologies = [], isLoading } = useSWR(
    selectedBedroomCount
      ? `${propertyId}-typologies-${selectedBedroomCount}`
      : null,
    () => fetchTypologies(propertyId, selectedBedroomCount)
  );

  return {
    typologies,
    uniqueBedroomCounts,
    selectedBedroomCount,
    setSelectedBedroomCount,
    isLoading,
  };
};
