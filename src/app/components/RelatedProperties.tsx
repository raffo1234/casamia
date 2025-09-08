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

  return (
    <Suspense>
      <RelatedPropertiesPage propertyId={propertyId} userEmail={userEmail} />
    </Suspense>
  );
}
