"use client";

import { supabase } from "../lib/supabase";
import useSWR from "swr";
import { PropertyState } from "@/types/propertyState";
import PropertiesGrid from "./PropertiesGrid";
import { PropertyType as PropertyTypeDb } from "@/types/propertyType";
import { Suspense } from "react";
import Home from "./Home";
import ResultPage from "./ResultPage";
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
          price,
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

const fetcher = async (searchTerms: string, category: string) => {
  const orConditions = columnsToSearch
    .map((column) => `${column}.ilike.%${searchTerms}%`)
    .join(",");

  const propertyType = category.toLowerCase().toUpperCase();

  const { data } = searchTerms
    ? ((await supabase
        .from("property")
        .select(query)
        .eq("state", PropertyState.ACTIVE)
        .eq("type", propertyType)
        .or(orConditions)
        .order("created_at", { ascending: false })
        .limit(4)) as { data: PropertyTypeDb[] | null })
    : ((await supabase
        .from("property")
        .select(query)
        .eq("type", propertyType)
        .eq("state", PropertyState.ACTIVE)
        .order("created_at", { ascending: false })
        .limit(4)) as { data: PropertyTypeDb[] | null });

  return data;
};

export default function PropertiesResult({
  userEmail,
}: {
  userEmail: string | null | undefined;
}) {
  const params = useParams();
  const searchTerms = params.searchWord as string;
  const decodedSearchWord = searchTerms
    ? decodeURIComponent(searchTerms)
    : searchTerms;
  const category = params.category as string;

  const { data: properties = [], isLoading } = useSWR(
    `${userEmail}-${searchTerms}-${category}-result-properties-first-ones`,
    () => fetcher(decodedSearchWord, category as string)
  );

  if (isLoading) return "Cargando ...";

  return (
    <PropertiesGrid>
      <Suspense>
        <Home properties={properties} userEmail={userEmail} />
      </Suspense>
      <Suspense>
        <ResultPage userEmail={userEmail} />
      </Suspense>
    </PropertiesGrid>
  );
}
