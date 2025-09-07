import BackLink from "@/components/BackLink";
import HeaderTitle from "@/components/HeaderTitle";
import PropertyAdminTabs from "@/components/PropertyAdminTabs";
import PropertyTypologies from "@/components/PropertyTypologies";
import Title from "@/components/Title";
import { Suspense } from "react";

type Params = Promise<{ id: string }>;

export default async function Page({ params }: { params: Params }) {
  const { id } = await params;

  return (
    <>
      <HeaderTitle>
        <Title>Tipologias</Title>
        <BackLink href={`/admin/property`}></BackLink>
      </HeaderTitle>
      <Suspense>
        <PropertyAdminTabs />
      </Suspense>
      <Suspense>
        <PropertyTypologies propertyId={id} />
      </Suspense>
    </>
  );
}
