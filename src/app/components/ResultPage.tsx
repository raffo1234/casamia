"use client";

import { supabase } from "@/lib/supabase";
import PropertiesList from "./PropertiesList";
import { PropertyState } from "@/types/propertyState";
import { PropertyType as PropertyTypeDb } from "@/types/propertyType";
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
  "transaction_type"
];

const fetcherTotal = async (
  decodedSearchWord: string,
  propertyType: string,
  transactionType: string
): Promise<number> => {
  const orConditions = columnsToSearch
    .map((column) => `${column}.ilike.%${decodedSearchWord}%`)
    .join(",");

  let supabaseQuery = supabase
    .from("property")
    .select("id", { count: "exact", head: true })
    .eq("state", PropertyState.ACTIVE)
    .eq("type", propertyType.toUpperCase())
    .eq("transaction_type", transactionType.toLowerCase()); // Add the transaction type filter

  if (decodedSearchWord) {
    supabaseQuery = supabaseQuery.or(orConditions);
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
  transactionType: string
) => {
  const orConditions = columnsToSearch
    .map((column) => `${column}.ilike.%${decodedSearchWord}%`)
    .join(",");

  let queryBuilder = supabase
    .from("property")
    .select(propertyQuery)
    .eq("state", PropertyState.ACTIVE)
    .eq("type", propertyType.toUpperCase())
    .eq("transaction_type", transactionType.toLowerCase()); // Add the transaction type filter

  if (decodedSearchWord) {
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

  const transactionType = params.transaction as string;

  return (
    <PropertiesList
      userEmail={userEmail}
      swrKeyPage={`${userEmail}-${searchTerms}-${propertyType}-${transactionType}-properties-home-page`}
      swrKeyTotal={`${userEmail}-${searchTerms}-${propertyType}-${transactionType}-properties-home-total`}
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
