import BackLink from "@/components/BackLink";
import EditPropertyInformation from "@/components/EditPropertyInformation";
import HeaderTitle from "@/components/HeaderTitle";
import Title from "@/components/Title";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

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
      <div className="mb-10">
        <Link
          href={`/admin/property/edit/${id}`}
          title="Volver"
          className="mb-4"
        >
          General
        </Link>
        <Link
          href={`/admin/property/edit/${id}/typologies`}
          title="Volver"
          className="mb-4"
        >
          Tipologias
        </Link>
      </div>

      <EditPropertyInformation id={id} userId={user?.id} />
    </>
  );
}
