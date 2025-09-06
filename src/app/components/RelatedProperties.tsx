import { Suspense } from "react";
import { auth } from "@/lib/auth";
import RelatedPropertiesPage from "./RelatedPropertiesPage";

export default async function RelatedProperties({
  propertyId,
}: {
  propertyId: string;
}) {
  const session = await auth();
  const userEmail = session?.user?.email;

  return (
    <Suspense>
      <RelatedPropertiesPage propertyId={propertyId} userEmail={userEmail} />
    </Suspense>
  );
}
