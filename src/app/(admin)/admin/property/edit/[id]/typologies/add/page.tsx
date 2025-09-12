import BackLink from "@/components/BackLink";
import HeaderTitle from "@/components/HeaderTitle";
import InsertPropertyType from "@/components/InsertPropertyTypology";
import Title from "@/components/Title";
import { Suspense } from "react";

type Params = Promise<{ id: string }>;

export default async function Page({ params }: { params: Params }) {
  const { id } = await params;

  return (
    <>
      <HeaderTitle>
        <Title>Agregar Tipolog&iacute;a</Title>
        <BackLink href={`/admin/property/edit/${id}/typologies`} />
      </HeaderTitle>
      <Suspense>
        <InsertPropertyType propertyId={id} />
      </Suspense>
    </>
  );
}
