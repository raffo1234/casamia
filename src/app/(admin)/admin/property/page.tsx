import AdminPropertiesList from "@/components/AdminPropertiesList";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import HeaderTitle from "@/components/HeaderTitle";
import Title from "@/components/Title";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Suspense } from "react";

export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <>
        <h3 className="mb-10 text-center text-2xl font-light">
          Para ver el administrador de contenidos, inicia sesion.
        </h3>
        <div className="w-fit mx-auto">
          <GoogleLoginButton />
        </div>
      </>
    );
  }

  const { data: userWithRole } = await supabase
    .from("user")
    .select("id, role_id")
    .eq("id", userId)
    .single();

  return (
    <>
      <HeaderTitle>
        <Title>Inmuebles</Title>
      </HeaderTitle>
      <Suspense>
        <AdminPropertiesList
          userId={userId}
          userRoleId={userWithRole?.role_id}
        />
      </Suspense>
    </>
  );
}
