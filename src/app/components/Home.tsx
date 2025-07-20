"use client";

import PropertyItem from "@/components/PropertyItem";
import { PropertyType } from "@/types/propertyType";
import { use } from "react";

interface SupabasePromiseResult {
  data: PropertyType[] | null;
  error: Error | null;
}

export default function Home({
  propertiesPromise,
  userEmail,
}: {
  propertiesPromise: Promise<SupabasePromiseResult>;
  userEmail: string | undefined | null;
}) {
  const { data: properties } = use(propertiesPromise);

  return properties?.map((property) => (
    <PropertyItem key={property.id} userEmail={userEmail} property={property} />
  ));
}
