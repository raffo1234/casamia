import PageContainer from "@/components/PageContainer";
import PropertiesResult from "@/components/PropertiesResult";
import SearchForm from "@/components/SearchForm";
import { auth } from "@/lib/auth";
import { Suspense } from "react";

export default async function Page() {
  const session = await auth();
  const userEmail = session?.user?.email;

  return (
    <PageContainer>
      <Suspense>
        <SearchForm />
        <PropertiesResult userEmail={userEmail} />
      </Suspense>
    </PageContainer>
  );
}
