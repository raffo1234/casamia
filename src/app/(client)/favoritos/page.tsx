import FavoritesWrapper from "@/components/FavoritesWrapper";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import SearchForm from "@/components/SearchForm";
import { auth } from "@/lib/auth";
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
          <h1 className="text-center">
            Necesitas iniciar sesión para poder ver tu lista de inmuebles
            favoritos.
          </h1>
          <GoogleLoginButton />
          <div className="flex justify-center w-[160px] rounded-full items-center mx-auto bg-slate-300 aspect-square bg-opacity-5">
            <Icon
              icon="solar:gallery-favourite-bold"
              className="text-[100px] text-white"
            />
          </div>
        </div>
      )}
    </>
  );
}
