import EditPropertyImages from "@/components/EditPropertyImages";
import { Suspense } from "react";

type Params = Promise<{ id: string }>;

export default async function Page({ params }: { params: Params }) {
  const { id } = await params;

  return (
    <Suspense>
      <EditPropertyImages propertyId={id} />
    </Suspense>
  );
}
