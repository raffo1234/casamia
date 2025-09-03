import SearchForm from "@/components/SearchForm";
import { supabase } from "@/lib/supabase";
import GetInTouch from "@/components/GetInTouch";
import { PropertyState } from "@/types/propertyState";
import { propertyQuery } from "@/queries/property";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { PropertyType } from "@/types/propertyType";
import { Suspense } from "react";
import PropertiesGrid from "@/components/PropertiesGrid";
import Home from "@/components/Home";
import CompanyPage from "@/components/CompanyPage";
import Link from "next/link";

type Params = Promise<{ slug: string[] }>;

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const session = await auth();
  const userEmail = session?.user?.email;

  const { data: company } = await supabase
    .from("company")
    .select("id, name, slug, logo_url, description")
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
    <>
      <Suspense>
        <SearchForm />
      </Suspense>
      <div className="mb-5">
        <div className="mb-10 flex gap-3 justify-between items-center-safe">
          {company ? (
            <div className="flex gap-3 items-center-safe">
              <span className="font-light">Por: </span>
              <Link
                href={`/empresa/${company.slug}`}
                title={company.name}
                className="flex text-lg items-center-safe gap-3"
              >
                <Image
                  src={company.logo_url}
                  alt={company.name}
                  className="rounded-full"
                  height="32"
                  width="32"
                />
                <span className="border-b-2 transition-colors hover:border-slate-300 border-slate-400">
                  {company.name}
                </span>
              </Link>
            </div>
          ) : null}
          {company ? (
            <GetInTouch
              companyId={company?.id}
              companyName={company?.name}
              companyLogo={company?.logo_url}
            />
          ) : null}
        </div>
        <p className="text-lg mb-30">{company?.description}</p>
      </div>
      <PropertiesGrid>
        <Suspense>
          <Home properties={properties} userEmail={userEmail} />
        </Suspense>
        <Suspense>
          <CompanyPage companyId={company?.id} userEmail={userEmail} />
        </Suspense>
      </PropertiesGrid>
    </>
  );
}
