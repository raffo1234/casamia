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
import { propertyQuery } from "@/queries/property";

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

const fetcher = async (searchTerms: string, category: string) => {
  const orConditions = columnsToSearch
    .map((column) => `${column}.ilike.%${searchTerms}%`)
    .join(",");

  const propertyType = category.toLowerCase().toUpperCase();

  const { data } = searchTerms
    ? ((await supabase
        .from("property")
        .select(propertyQuery)
        .eq("state", PropertyState.ACTIVE)
        .eq("type", propertyType)
        .or(orConditions)
        .order("created_at", { ascending: false })
        .limit(4)) as { data: PropertyTypeDb[] | null })
    : ((await supabase
        .from("property")
        .select(propertyQuery)
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

  if (isLoading)
    return (
      <PropertiesGrid>
        <div className="bg-slate-100 w-full aspect-[5/4] rounded-3xl"></div>
        <div className="bg-slate-100 w-full aspect-[5/4] rounded-3xl"></div>
        <div className="bg-slate-100 w-full aspect-[5/4] rounded-3xl"></div>
        <div className="bg-slate-100 w-full aspect-[5/4] rounded-3xl"></div>
      </PropertiesGrid>
    );

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
