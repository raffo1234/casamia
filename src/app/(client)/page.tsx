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
    <>
      <h1
        style={{
          fontSize: "clamp(16px, 6vw + .5rem, 63px)",
        }}
        className="font-flaviotte w-full mb-20 leading-tight text-center"
      >
        Tu nuevo hogar <br /> te espera.
      </h1>
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
    </>
  );
}
