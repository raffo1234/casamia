import { favoriteQuery } from "@/queries/property";
import { PropertyState } from "@/types/propertyState";
import { supabase } from "@/lib/supabase";
import { PropertyType } from "@/types/propertyType";
import PropertiesGrid from "./PropertiesGrid";
import Home from "./Home";
import FavoritePage from "./FavoritePage";
import NoItems from "./NoItems";
import { RawLikeType } from "@/types/RawLikeType";

export default async function FavoritesWrapper({
  userId,
  userEmail,
}: {
  userId: string;
  userEmail: string;
}) {
  const { data: rawLikes, error } = (await supabase
    .from("like")
    .select(favoriteQuery)
    .eq("user_id", userId)
    .eq("property.state", PropertyState.ACTIVE)
    .order("created_at", { ascending: false })
    .limit(4)) as { data: RawLikeType[] | null; error: Error | null };

  if (error) {
    return (
      <div className="text-red-500 text-center">
        Error al cargar propiedades favoritas.
      </div>
    );
  }

  const properties: PropertyType[] = rawLikes
    ? rawLikes.map((likeItem) => {
        return {
          ...likeItem.property,
          user: likeItem.property.user?.[0],
          company: likeItem.property.company?.[0],
        };
      })
    : [];

  const hasProperties = properties.length > 0;

  return hasProperties ? (
    <PropertiesGrid>
      <Home properties={properties} userEmail={userEmail} />
      <FavoritePage userId={userId} userEmail={userEmail} />
    </PropertiesGrid>
  ) : (
    <NoItems />
  );
}
