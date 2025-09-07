"use client";

import { supabase } from "@/lib/supabase";
import PropertiesList from "./PropertiesList";
import { PropertyState } from "@/types/propertyState";
import { PropertyType as PropertyTypeDb } from "@/types/propertyType";
import { useParams } from "next/navigation";
import { propertyQuery } from "@/queries/property";

const fetcherTotal = async (
  decodedSearchWord: string,
  propertyType: string,
  transactionType?: string
): Promise<number> => {
  let supabaseQuery = supabase
    .from("property")
    .select("id", { count: "exact", head: true })
    .eq("state", PropertyState.ACTIVE)
    .eq("type", propertyType.toUpperCase());

  if (transactionType) {
    supabaseQuery = supabaseQuery.eq(
      "transaction_type",
      transactionType.toLowerCase()
    );
  }

  if (decodedSearchWord) {
    supabaseQuery = supabaseQuery.textSearch(
      "fts_vector",
      decodedSearchWord.trim().split(/\s+/).join(" & ")
    );
  }

  const { count, error } = await supabaseQuery;

  if (error) {
    console.error("Error fetching total property count:", error);
    throw new Error("Failed to fetch total property count.");
  }
  return count || 0;
};

const fetcherPage = async (
  index: number,
  pageSize: number,
  decodedSearchWord: string,
  propertyType: string,
  transactionType?: string
) => {
  let queryBuilder = supabase
    .from("property")
    .select(propertyQuery)
    .eq("state", PropertyState.ACTIVE)
    .eq("type", propertyType.toUpperCase());

  if (transactionType) {
    queryBuilder = queryBuilder.eq(
      "transaction_type",
      transactionType.toLowerCase()
    );
  }

  if (decodedSearchWord) {
    queryBuilder = queryBuilder.textSearch(
      "fts_vector",
      decodedSearchWord.trim().split(/\s+/).join(" & ")
    );
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

export default function ResultPage({
  userEmail,
}: {
  userEmail: string | undefined | null;
}) {
  const params = useParams();
  const searchTerms = params.searchWord as string;
  const decodedSearchWord = searchTerms
    ? decodeURIComponent(searchTerms)
    : searchTerms;
  const propertyType = params.category as string;

  const transactionType = params.transaction as string | undefined;

  return (
    <PropertiesList
      userEmail={userEmail}
      swrKeyPage={`${userEmail}-${searchTerms}-${propertyType}-${
        transactionType || ""
      }-properties-home-page`}
      swrKeyTotal={`${userEmail}-${searchTerms}-${propertyType}-${
        transactionType || ""
      }-properties-home-total`}
      fetcherPage={(index, pageSize) =>
        fetcherPage(
          index,
          pageSize,
          decodedSearchWord,
          propertyType,
          transactionType
        )
      }
      fetcherTotal={() =>
        fetcherTotal(decodedSearchWord, propertyType, transactionType)
      }
    />
  );
}
