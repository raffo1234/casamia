import BackLink from "@/components/BackLink";
import EditPropertyInformation from "@/components/EditPropertyInformation";
import HeaderTitle from "@/components/HeaderTitle";
import PropertyAdminTabs from "@/components/PropertyAdminTabs";
import Title from "@/components/Title";
import { auth } from "@/lib/auth";
import { Suspense } from "react";

type Params = Promise<{ id: string }>;

export default async function Page({ params }: { params: Params }) {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <>
      <HeaderTitle>
        <Title>Inmueble</Title>
        <BackLink href={`/admin/property`}></BackLink>
      </HeaderTitle>
      <Suspense>
        <PropertyAdminTabs />
      </Suspense>
      <Suspense>
        {userId ? <EditPropertyInformation id={id} userId={userId} /> : null}
      </Suspense>
    </>
  );
}
