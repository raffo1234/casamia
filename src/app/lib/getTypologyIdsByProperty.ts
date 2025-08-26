import { supabase } from "./supabase";

export async function getTypologyIdsByProperty(propertyId: string) {
  const { data, error } = await supabase
    .from("typology")
    .select("id")
    .eq("property_id", propertyId);

  if (error) {
    console.error("Error fetching typologies:", error);
    return [];
  }

  return data?.map((t) => t.id) || [];
}
