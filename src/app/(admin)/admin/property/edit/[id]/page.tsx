import EditPropertyInformation from "@/components/EditPropertyInformation";
import Title from "@/components/Title";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Icon } from "@iconify/react";
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
        <Title>Editar Inmueble</Title>
        <Link href="/admin/property" title="Volver" className="mb-4">
          <Icon icon="solar:square-alt-arrow-left-broken" fontSize="32" />
        </Link>
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
