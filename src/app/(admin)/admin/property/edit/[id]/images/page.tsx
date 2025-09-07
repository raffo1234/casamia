import BackLink from "@/components/BackLink";
import EditPropertyImages from "@/components/EditPropertyImages";
import HeaderTitle from "@/components/HeaderTitle";
import PropertyAdminTabs from "@/components/PropertyAdminTabs";
import Title from "@/components/Title";
import { Suspense } from "react";

type Params = Promise<{ id: string }>;

export default async function Page({ params }: { params: Params }) {
  const { id } = await params;

  return (
    <>
      <HeaderTitle>
        <Title>Imagenes</Title>
        <BackLink href={`/admin/property/edit/${id}`} />
      </HeaderTitle>
      <Suspense>
        <PropertyAdminTabs />
      </Suspense>
      <Suspense>
        <EditPropertyImages propertyId={id} />
      </Suspense>
    </>
  );
}
