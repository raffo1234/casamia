import { PropertyState } from "@/types/propertyState";
import { PropertyType } from "@/types/propertyType";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getUserLikesPromise(
  supabase: SupabaseClient,
  userId: string | undefined,
  favoriteQuery: string
) {
  return supabase
    .from("like")
    .select(favoriteQuery)
    .eq("property.state", PropertyState.ACTIVE)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(4);
}

export type UserLikedProperty = {
  property: PropertyType;
};
