import { favoriteQuery } from "@/queries/property";
import { PropertyState } from "@/types/propertyState";
import { supabase } from "@/lib/supabase";
import { PropertyType } from "@/types/propertyType";
import { Suspense, use } from "react";
import PropertiesGrid from "./PropertiesGrid";
import Home from "./Home";
import FavoritePage from "./FavoritePage";
import NoItems from "./NoItems";

export default function FavoritesWrapper({
  userId,
  userEmail,
}: {
  userId: string;
  userEmail: string;
}) {
  const { data: rawLikes, error } = use(
    supabase
      .from("like")
      .select(favoriteQuery)
      .eq("user_id", userId)
      .eq("property.state", PropertyState.ACTIVE)
      .order("created_at", { ascending: false })
      .limit(4)
  ) as {
    data: { property: PropertyType }[] | null;
    error: Error | null;
  };

  if (error) {
    throw new Error(
      `Failed to fetch initial liked properties: ${
        error.message || JSON.stringify(error)
      }`
    );
  }

  const properties: PropertyType[] | null = rawLikes
    ? rawLikes
        .filter(
          (item): item is { property: PropertyType } =>
            item !== null && item.property !== null
        )
        .map((likeItem) => likeItem.property)
    : null;

  return properties && properties.length > 0 ? (
    <PropertiesGrid>
      <Suspense>
        <Home properties={properties} userEmail={userEmail} />
      </Suspense>
      <Suspense>
        <FavoritePage userId={userId} userEmail={userEmail} />
      </Suspense>
    </PropertiesGrid>
  ) : (
    <NoItems />
  );
}
