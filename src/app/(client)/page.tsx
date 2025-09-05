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
import PrimaryButton from "@/components/PrimaryButton";
import NoItems from "@/components/NoItems";

export default async function Index() {
  const session = await auth();
  const userEmail = session?.user?.email;

  const { data: properties } = (await supabase
    .from("property")
    .select(propertyQuery)
    .eq("state", PropertyState.ACTIVE)
    .order("created_at", { ascending: false })
    .limit(4)) as { data: PropertyType[] | null };

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
      {properties && properties.length > 0 ? (
        <PropertiesGrid>
          <Suspense>
            <Home properties={properties} userEmail={userEmail} />
          </Suspense>
          <Suspense>
            <HomePage userEmail={userEmail} />
          </Suspense>
        </PropertiesGrid>
      ) : (
        <NoItems />
      )}
    </>
  );
}
