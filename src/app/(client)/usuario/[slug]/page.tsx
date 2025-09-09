import SearchForm from "@/components/SearchForm";
import { supabase } from "@/lib/supabase";
import { PropertyState } from "@/types/propertyState";
import { propertyQuery } from "@/queries/property";
import { auth } from "@/lib/auth";
import { PropertyType } from "@/types/propertyType";
import PropertiesGrid from "@/components/PropertiesGrid";
import Home from "@/components/Home";
import UserPage from "@/components/UserPage";
import NoItems from "@/components/NoItems";
import PageContainer from "@/components/PageContainer";
import AuthorLink from "@/components/AuthorLink";

type Params = Promise<{ slug: string }>;

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const session = await auth();
  const userEmail = session?.user?.email;

  const { data: user } = await supabase
    .from("user")
    .select("id, slug, name, image_url, username, email")
    .eq("slug", slug)
    .single();

  const { data: properties } = (await supabase
    .from("property")
    .select(propertyQuery)
    .eq("user_id", user?.id)
    .eq("state", PropertyState.ACTIVE)
    .is("company_id", null)
    .order("created_at", { ascending: false })
    .limit(4)) as { data: PropertyType[] | null };

  return (
    <PageContainer>
      <SearchForm />
      <div className="mb-5">
        <div className="mb-10 flex gap-3 justify-between items-center-safe">
          <AuthorLink user={user} />
        </div>
      </div>
      {properties && properties.length > 0 ? (
        <PropertiesGrid>
          <Home properties={properties} userEmail={userEmail} />
          {user ? <UserPage userId={user.id} userEmail={userEmail} /> : null}
        </PropertiesGrid>
      ) : (
        <NoItems />
      )}
    </PageContainer>
  );
}
