import PropertiesFavorite from "@/components/PropertiesFavorite";
import SearchForm from "@/components/SearchForm";
import { auth, signIn } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { favoriteQuery } from "@/queries/property";
import { PropertyState } from "@/types/propertyState";
import { PropertyType } from "@/types/propertyType";
import { Icon } from "@iconify/react";
import { Suspense, use } from "react";

export default function Page() {
  const session = use(auth());
  const userEmail = session?.user?.email;

  const { data: user } = use(
    supabase.from("user").select("id").eq("email", userEmail).single()
  );

  const userId = user?.id;

  const { data: likes } = use(
    supabase
      .from("like")
      .select(favoriteQuery)
      .eq("property.state", PropertyState.ACTIVE)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(4)
  ) as {
    data: { property: PropertyType }[] | null;
  };

  return (
    <>
      <SearchForm />
      {userEmail ? (
        <Suspense>
          <PropertiesFavorite
            likes={likes}
            userId={userId}
            userEmail={userEmail}
          />
        </Suspense>
      ) : (
        <div className="max-w-md mx-auto items-center flex flex-col gap-10">
          <div className="flex justify-center w-[300px] rounded-full items-center mx-auto bg-cyan-500 aspect-square bg-opacity-5">
            <Icon
              icon="solar:gallery-favourite-bold"
              className="text-[200px] text-white"
            />
          </div>
          <h1 className="text-center">
            Necesitas iniciar sesión para poder ver tu lista de inmuebles
            favoritos.
          </h1>
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <button
              type="submit"
              className="block px-6 py-2 bg-black text-white rounded-full transition-colors duration-700 hover:bg-gray-800 active:bg-gray-900"
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      )}
    </>
  );
}
