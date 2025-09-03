import EditPropertyType from "@/components/EditPropertyType";
import { Suspense } from "react";

type Params = Promise<{ id: string; typologyId: string }>;

export default async function Page({ params }: { params: Params }) {
  const { typologyId, id } = await params;

  return (
    <Suspense>
      <EditPropertyType propertyId={id} typologyId={typologyId} />
    </Suspense>
  );
}
