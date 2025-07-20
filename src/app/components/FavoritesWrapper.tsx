import { favoriteQuery } from "@/queries/property";
import PropertiesFavorite from "./PropertiesFavorite";
import { PropertyState } from "@/types/propertyState";
import { supabase } from "@/lib/supabase";
import { PropertyType } from "@/types/propertyType";
import { use } from "react";

export default function FavoritesWrapper({
  userId,
  userEmail,
}: {
  userId: string;
  userEmail: string;
}) {
  const { data: likes } = use(
    supabase
      .from("like")
      .select(favoriteQuery)
      .eq("property.state", PropertyState.ACTIVE)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(4)
  ) as {
    data: { property: PropertyType }[] | null;
  };

  return (
    <PropertiesFavorite likes={likes} userId={userId} userEmail={userEmail} />
  );
}
