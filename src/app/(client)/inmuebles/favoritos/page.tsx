import FavoritesWrapper from "@/components/FavoritesWrapper";
import SearchForm from "@/components/SearchForm";
import { auth, signIn } from "@/lib/auth";
import { Icon } from "@iconify/react";
import { Suspense, use } from "react";

export default function Page() {
  const session = use(auth());
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  return (
    <>
      <SearchForm />
      {userId && userEmail ? (
        <Suspense>
          <FavoritesWrapper userId={userId} userEmail={userEmail} />
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
