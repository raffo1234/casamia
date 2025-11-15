import { auth } from "@/lib/auth";
import { propertyQuery } from "@/queries/property";
import { PropertyState } from "@/types/propertyState";
import { supabase } from "@/lib/supabase";
import PropertiesGrid from "@/components/PropertiesGrid";
import SearchForm from "@/components/SearchForm";
import { Suspense } from "react";
import Home from "@/components/Home";
import { PropertyType } from "@/types/propertyType";
import HomePage from "@/components/HomePage";
import NoItems from "@/components/NoItems";
import { Session } from "next-auth";
import PageContainer from "@/components/PageContainer";
import ClientBg from "@/components/ClientBg";

export default async function Index() {
  const [session, { data: properties }] = (await Promise.all([
    auth(),
    supabase
      .from("property")
      .select(propertyQuery)
      .eq("state", PropertyState.ACTIVE)
      .order("created_at", { ascending: false })
      .limit(4),
  ])) as [Session | null, { data: PropertyType[] | null }];

  const userEmail = session?.user?.email;
  const hasProperties = properties && properties.length > 0;

  return (
    <PageContainer>
      <h1
        style={{
          fontSize: "clamp(16px, 6vw + .5rem, 56px)",
        }}
        className="text-slate-900 font-inter-tight tracking-tight font-semibold w-full leading-tight text-center"
      >
        Tu nuevo hogar te espera
      </h1>
      <p className="text-slate-500 text-xl text-center font-inter-tight mt-5 mb-16 max-w-[620px] mx-auto">
        Encuentra la propiedad perfecta
      </p>
      <Suspense>
        <SearchForm />
      </Suspense>
      {hasProperties ? (
        <PropertiesGrid>
          <Home properties={properties} userEmail={userEmail} />
          <HomePage userEmail={userEmail} />
        </PropertiesGrid>
      ) : (
        <NoItems />
      )}
    </PageContainer>
  );
}
