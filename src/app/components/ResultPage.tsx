"use client";

import { supabase } from "@/lib/supabase";
import PropertiesList from "./PropertiesList";
import { PropertyState } from "@/types/propertyState";
import { PropertyType as PropertyTypeDb } from "@/types/propertyType";
import { useParams } from "next/navigation";

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

export default function ResultPage({
  userEmail,
}: {
  userEmail: string | undefined | null;
}) {
  const params = useParams();
  const searchTerms = params.searchWord as string;
  const propertyType = params.category as string;

  const fetcherTotal = async (): Promise<number> => {
    const orConditions = columnsToSearch
      .map((column) => `${column}.ilike.%${searchTerms}%`)
      .join(",");

    let supabaseQuery = supabase
      .from("property")
      .select("id", { count: "exact", head: true })
      .eq("state", PropertyState.ACTIVE)
      .eq("type", propertyType.toUpperCase());

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

    let queryBuilder = supabase
      .from("property")
      .select(query)
      .eq("state", PropertyState.ACTIVE)
      .eq("type", propertyType.toUpperCase());

    if (searchTerms) {
      queryBuilder = queryBuilder.or(orConditions);
    }

    const { data, error } = (await queryBuilder
      .order("created_at", { ascending: false })
      .range(index * pageSize, index * pageSize + pageSize - 1)) as {
      data: PropertyTypeDb[] | null;
      error: Error | null;
    };

    if (error) {
      throw new Error(
        `Failed to fetch properties: ${error.message || JSON.stringify(error)}`
      );
    }

    return data;
  };

  return (
    <PropertiesList
      userEmail={userEmail}
      swrKeyPage={`${userEmail}-${searchTerms}-${propertyType}-properties-home-page`}
      swrKeyTotal={`${userEmail}-${searchTerms}-${propertyType}-properties-home-total`}
      fetcherPage={fetcherPage}
      fetcherTotal={fetcherTotal}
    />
  );
}
