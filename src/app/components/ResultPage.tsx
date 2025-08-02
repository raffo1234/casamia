"use client";

import { supabase } from "@/lib/supabase";
import PropertiesList from "./PropertiesList";
import { PropertyState, PropertyType } from "@/types/propertyState";
import { PropertyType as PropertyTypeDb } from "@/types/propertyType";
import getLastSlashValueFromCurrentUrl from "@/utils/getLastSlashValueFromCurrentUrl";
import { usePathname } from "next/navigation";

const columnsToSearch = [
  "title",
  "description",
  "location",
  "price",
  "state",
  "type",
  "phase",
  "size",
  "bathroom_count",
  "bedroom_count",
];

const query = `
          id,
          title,
          description,
          user_id,
          type,
          property_image (
            image_url
          ),
          user!property_user_id_fkey (
            id,
            email,
            name,
            image_url
          ),
          company!property_company_id_fkey (
            id,
            name,
            image_url,
            logo_url
          )
        `;

const searchTerms = getLastSlashValueFromCurrentUrl() || "";

export default function ResultPage({
  userEmail,
}: {
  userEmail: string | undefined | null;
}) {
  const pathname = usePathname();
  const pathnameArray = pathname
    .split("/")
    .filter((segment: string) => segment !== "");

  const fetcherTotal = async (): Promise<number> => {
    const orConditions = columnsToSearch
      .map((column) => `${column}.ilike.%${searchTerms}%`)
      .join(",");

    const propertyType =
      (pathnameArray?.at(0)?.toUpperCase() as PropertyType) ||
      PropertyType.APARTMENT;

    let supabaseQuery = supabase
      .from("property")
      .select("id", { count: "exact", head: true }) // Select 'id' for count
      .eq("state", PropertyState.ACTIVE)
      .eq("type", propertyType);

    if (searchTerms) {
      supabaseQuery = supabaseQuery.or(orConditions);
    }

    const { count, error } = await supabaseQuery;

    if (error) {
      console.error("Error fetching total property count:", error);
      throw new Error("Failed to fetch total property count.");
    }
    return count || 0;
  };

  const fetcherPage = async (index: number, pageSize: number) => {
    const orConditions = columnsToSearch
      .map((column) => `${column}.ilike.%${searchTerms}%`)
      .join(",");

    const propertyType =
      (pathnameArray?.at(0)?.toUpperCase() as PropertyType) ||
      PropertyType.APARTMENT;

    const { data } = searchTerms
      ? ((await supabase
          .from("property")
          .select(query)
          .eq("state", PropertyState.ACTIVE)
          .eq("type", propertyType)
          .or(orConditions)
          .order("created_at", { ascending: false })
          .range(index * pageSize, index * pageSize + pageSize - 1)) as {
          data: PropertyTypeDb[] | null;
        })
      : ((await supabase
          .from("property")
          .select(query)
          .eq("type", propertyType)
          .eq("state", PropertyState.ACTIVE)
          .order("created_at", { ascending: false })
          .range(index * pageSize, index * pageSize + pageSize - 1)) as {
          data: PropertyTypeDb[] | null;
        });

    return data;
  };

  return (
    <PropertiesList
      userEmail={userEmail}
      swrKeyPage="properties-home-page"
      swrKeyTotal="properties-home-total"
      fetcherPage={fetcherPage}
      fetcherTotal={fetcherTotal}
    />
  );
}
