import EditPropertyImages from "@/components/EditPropertyImages";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

type Params = Promise<{ id: string }>;

export default async function Page({ params }: { params: Params }) {
  const { id } = await params;
  const session = await auth();
  const userEmail = session?.user?.email;

  const { data: user } = await supabase
    .from("user")
    .select("id, role_id")
    .eq("email", userEmail)
    .single();

  const userId = user?.id;

  return <EditPropertyImages userId={userId} propertyId={id} />;
}
