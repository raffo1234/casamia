"use client";
import { Suspense } from "react";
import RelatedPropertiesPage from "./RelatedPropertiesPage";

export default function RelatedProperties({
  propertyId,
  userEmail,
}: {
  propertyId: string;
  userEmail: string | undefined | null;
}) {
  // Use client-side data fetching here, if needed
  // e.g., const { data, error } = useSWR(...);

  return (
    <Suspense>
      <RelatedPropertiesPage propertyId={propertyId} userEmail={userEmail} />
    </Suspense>
  );
}
