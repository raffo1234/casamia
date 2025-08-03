"use client";

import { supabase } from "@/lib/supabase";
import PropertiesList from "./PropertiesList";
import { propertyQuery } from "@/queries/property";
import { PropertyState } from "@/types/propertyState";
import { PropertyType } from "@/types/propertyType";

export default function CompanyPage({
  userEmail,
  companyId,
}: {
  userEmail: string | undefined | null;
  companyId: string;
}) {
  const fetcherTotal = async (): Promise<number> => {
    const { count, error } = await supabase
      .from("property")
      .select("id", { count: "exact", head: true })
      .eq("state", PropertyState.ACTIVE)
      .eq("company_id", companyId);

    if (error) {
      console.error("Error fetching total property count:", error);
      throw new Error("Failed to fetch total property count.");
    }
    return count || 0;
  };

  const fetcherPage = async (index: number, pageSize: number) => {
    const { data } = (await supabase
      .from("property")
      .select(propertyQuery)
      .eq("state", PropertyState.ACTIVE)
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })
      .range(index * pageSize, index * pageSize + pageSize - 1)) as {
      data: PropertyType[] | null;
    };

    return data;
  };

  return (
    <PropertiesList
      userEmail={userEmail}
      swrKeyPage={`properties-company-page-${companyId}`}
      swrKeyTotal={`properties-company-total-${companyId}`}
      fetcherPage={fetcherPage}
      fetcherTotal={fetcherTotal}
    />
  );
}
