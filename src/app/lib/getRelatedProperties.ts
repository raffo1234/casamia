import { propertyQuery } from "@/queries/property"; // Import your query string
import { supabase } from "./supabase";
import { PropertyType } from "@/types/propertyType";
import { PropertyState } from "@/types/propertyState";

export async function getRelatedProperties(targetPropertyId: string) {
  const { data: relatedPropertyIds, error: rpcError } = await supabase.rpc(
    "get_related_properties",
    { target_property_id: targetPropertyId }
  );

  if (rpcError) {
    console.error("Error fetching related property IDs:", rpcError);
    return null;
  }

  const ids = relatedPropertyIds.map((p: PropertyType) => p.id);

  if (ids.length === 0) {
    return [];
  }

  const { data: properties, error: selectError } = (await supabase
    .from("property")
    .select(propertyQuery)
    .in("id", ids)
    .eq("state", PropertyState.ACTIVE)
    .order("created_at", { ascending: false })) as {
    data: PropertyType[] | null;
    error: Error;
  };

  if (selectError) {
    console.error("Error fetching detailed property data:", selectError);
    return null;
  }

  return properties;
}
