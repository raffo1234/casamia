import AdminPropertiesList from "@/components/AdminPropertiesList";
import Title from "@/components/Title";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export default async function Page() {
  const session = await auth();
  const userEmail = session?.user?.email;

  const { data: user } = await supabase
    .from("user")
    .select("id, role_id")
    .eq("email", userEmail)
    .single();

  const userId = user?.id;

  return (
    <>
      <Title>Inmuebles</Title>
      <AdminPropertiesList userId={userId} userRoleId={user?.role_id} />
    </>
  );
}
