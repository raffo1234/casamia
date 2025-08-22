import BackLink from "@/components/BackLink";
import EditPropertyInformation from "@/components/EditPropertyInformation";
import HeaderTitle from "@/components/HeaderTitle";
import PropertyAdminTabs from "@/components/PropertyAdminTabs";
import Title from "@/components/Title";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

type Params = Promise<{ id: string }>;

export default async function Page({ params }: { params: Params }) {
  const { id } = await params;
  const session = await auth();
  const userEmail = session?.user?.email;

  const { data: user } = await supabase
    .from("user")
    .select("id")
    .eq("email", userEmail)
    .single();

  return (
    <>
      <div className="flex items-center justify-between">
        <HeaderTitle>
          <Title>Editar Inmueble</Title>
          <BackLink href={`/admin/property`}></BackLink>
        </HeaderTitle>
      </div>
      <PropertyAdminTabs />
      <EditPropertyInformation id={id} userId={user?.id} />
    </>
  );
}
