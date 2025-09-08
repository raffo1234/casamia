import SearchForm from "@/components/SearchForm";
import { supabase } from "@/lib/supabase";
import { PropertyState } from "@/types/propertyState";
import { propertyQuery } from "@/queries/property";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { PropertyType } from "@/types/propertyType";
import { Suspense } from "react";
import PropertiesGrid from "@/components/PropertiesGrid";
import Home from "@/components/Home";
import Link from "next/link";
import UserPage from "@/components/UserPage";
import NoItems from "@/components/NoItems";
import PageContainer from "@/components/PageContainer";

type Params = Promise<{ slug: string[] }>;

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const session = await auth();
  const userEmail = session?.user?.email;

  const { data: user } = await supabase
    .from("user")
    .select("id, slug, first_name, last_name, image_url")
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
      <Suspense>
        <SearchForm />
      </Suspense>
      <div className="mb-5">
        <div className="mb-10 flex gap-3 justify-between items-center-safe">
          {user ? (
            <div className="flex gap-3 items-center-safe ">
              <span className="font-light">Por: </span>
              <Link
                href={`/usuario/${user.slug}`}
                title={user.first_name}
                className="flex text-lg items-center-safe gap-3"
              >
                <Image
                  src={user.image_url}
                  alt={user.first_name}
                  className="rounded-full"
                  height="32"
                  width="32"
                />
                <span className="border-b-2 transition-colors hover:border-slate-300 border-slate-400">
                  {user.first_name} {user.last_name}
                </span>
              </Link>
            </div>
          ) : null}
          {/* {company ? (
            <GetInTouch
              companyId={company?.id}
              companyName={company?.name}
              companyLogo={company?.logo_url}
            />
          ) : null} */}
        </div>
      </div>
      {properties && properties.length > 0 ? (
        <PropertiesGrid>
          <Suspense>
            <Home properties={properties} userEmail={userEmail} />
          </Suspense>
          <Suspense>
            {user ? <UserPage userId={user.id} userEmail={userEmail} /> : null}
            {/* <CompanyPage companyId={company?.id} userEmail={userEmail} /> */}
          </Suspense>
        </PropertiesGrid>
      ) : (
        <NoItems />
      )}
    </PageContainer>
  );
}
