import SearchForm from "@/components/SearchForm";
import { supabase } from "@/lib/supabase";
import { PropertyState } from "@/types/propertyState";
import { propertyQuery } from "@/queries/property";
import { auth } from "@/lib/auth";
import { PropertyType } from "@/types/propertyType";
import { Suspense } from "react";
import PropertiesGrid from "@/components/PropertiesGrid";
import Home from "@/components/Home";
import CompanyPage from "@/components/CompanyPage";
import NoItems from "@/components/NoItems";
import PageContainer from "@/components/PageContainer";
import AuthorLink from "@/components/AuthorLink";

type Params = Promise<{ slug: string[] }>;

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const session = await auth();
  const userEmail = session?.user?.email;

  const { data: company } = await supabase
    .from("company")
    .select("id, name, slug, image_url, description")
    .eq("slug", slug)
    .single();

  const { data: properties } = (await supabase
    .from("property")
    .select(propertyQuery)
    .eq("company_id", company?.id)
    .eq("state", PropertyState.ACTIVE)
    .order("created_at", { ascending: false })
    .limit(4)) as { data: PropertyType[] | null };

  return (
    <PageContainer>
      <Suspense>
        <SearchForm />
      </Suspense>
      <div className="mb-5">
        <div className="mb-10 flex gap-3 justify-between items-center-safe">
          <AuthorLink company={company} />
        </div>
        <p className="text-lg mb-30">{company?.description}</p>
      </div>
      {properties && properties.length > 0 ? (
        <PropertiesGrid>
          <Suspense>
            <Home properties={properties} userEmail={userEmail} />
          </Suspense>
          <Suspense>
            <CompanyPage companyId={company?.id} userEmail={userEmail} />
          </Suspense>
        </PropertiesGrid>
      ) : (
        <NoItems />
      )}
    </PageContainer>
  );
}
