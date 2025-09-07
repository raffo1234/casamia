"use client";

import { supabase } from "@/lib/supabase";
import PropertiesList from "./PropertiesList";
import { PropertyState } from "@/types/propertyState";
import { PropertyType } from "@/types/propertyType";
import { favoriteQuery } from "@/queries/property";

const fetcherPage = async (
  index: number,
  pageSize: number,
  userId: string | undefined | null
): Promise<PropertyType[] | null> => {
  if (!userId) {
    return null; // No user, no liked properties
  }

  const { data: rawLikes, error } = (await supabase
    .from("like")
    .select(favoriteQuery)
    .eq("user_id", userId)
    .eq("property.state", PropertyState.ACTIVE)
    .order("created_at", { ascending: false })
    .range(index * pageSize, index * pageSize + pageSize - 1)) as {
    data: { property: PropertyType }[] | null;
    error: Error | null;
  };

  if (error) {
    console.error("Error fetching liked properties page:", error);

    throw new Error(
      `Failed to fetch liked properties page: ${
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

  return properties;
};

const fetcherTotal = async (
  userId: string | undefined | null
): Promise<number> => {
  if (!userId) {
    return 0;
  }

  const { count, error } = await supabase
    .from("like")
    .select(favoriteQuery, { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("property.state", PropertyState.ACTIVE);

  if (error) {
    console.error("Error fetching total liked property count:", error);
    throw new Error("Failed to fetch total liked property count.");
  }
  return count || 0;
};

export default function FavoritePage({
  userEmail,
  userId,
}: {
  userEmail: string | undefined | null;
  userId: string | undefined | null;
}) {
  const getFetcherPageWithUser = (index: number, pageSize: number) =>
    fetcherPage(index, pageSize, userId);

  const getFetcherTotalWithUser = () => fetcherTotal(userId);

  return (
    <PropertiesList
      userEmail={userEmail}
      swrKeyPage="liked-properties-page"
      swrKeyTotal="liked-properties-total"
      fetcherPage={getFetcherPageWithUser}
      fetcherTotal={getFetcherTotalWithUser}
    />
  );
}
