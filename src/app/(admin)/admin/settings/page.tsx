import HeaderTitle from "@/components/HeaderTitle";
import SettingsContent from "@/components/SettingsContent";
import Title from "@/components/Title";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { RoleType } from "@/types/RoleType";

export default async function Page() {
  const session = await auth();
  const user = session?.user;

  const { data } = await supabase.from("user").select("role_id").eq("id", user?.id).single();

  const { data: roles } = (await supabase
    .from("role")
    .select("id, name")
    .order("name", { ascending: true })) as { data: RoleType[] | null };

  if (!user || !data) return null;

  return (
    <>
      <HeaderTitle>
        <Title>Settings</Title>
      </HeaderTitle>
      <SettingsContent userRoleId={data.role_id} roles={roles} />
    </>
  );
}
