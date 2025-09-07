import BackLink from "@/components/BackLink";
import EditPropertyType from "@/components/EditPropertyType";
import HeaderTitle from "@/components/HeaderTitle";
import Title from "@/components/Title";
import TypologyAdminTabs from "@/components/TypologyAdminTabs";
import { Suspense } from "react";

type Params = Promise<{ id: string; typologyId: string }>;

export default async function Page({ params }: { params: Params }) {
  const { typologyId, id } = await params;

  return (
    <>
      <HeaderTitle>
        <Title>Editar Tipologia</Title>
        <BackLink href={`/admin/property/edit/${id}/typologies`}></BackLink>
      </HeaderTitle>
      <Suspense>
        <TypologyAdminTabs />
      </Suspense>
      <Suspense>
        <EditPropertyType propertyId={id} typologyId={typologyId} />
      </Suspense>
    </>
  );
}
