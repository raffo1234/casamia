import PropertiesResult from "@/components/PropertiesResult";
import SearchForm from "@/components/SearchForm";
import { auth } from "@/lib/auth";
import { Suspense } from "react";

export default async function Page() {
  const session = await auth();
  const userEmail = session?.user?.email;

  return (
    <>
      <Suspense>
        <SearchForm />
      </Suspense>
      <Suspense>
        <PropertiesResult userEmail={userEmail} />
      </Suspense>
    </>
  );
}
