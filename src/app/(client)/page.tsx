import { auth } from "@/lib/auth";
import { propertyQuery } from "@/queries/property";
import { PropertyState } from "@/types/propertyState";
import { supabase } from "@/lib/supabase";
import PropertiesGrid from "@/components/PropertiesGrid";
import SearchForm from "@/components/SearchForm";
import HightLightSelect from "@/components/HighLightSelect";
import { Suspense } from "react";
import Home from "@/components/Home";
import { PropertyType } from "@/types/propertyType";
import HomePage from "@/components/HomePage";

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
          fontSize: "clamp(16px, 6vw + .5rem, 50px)",
        }}
        className="w-full mb-10 leading-tight text-center"
      >
        Encuentra tu próximo <br /> hogar
      </h1>
      <SearchForm />
      <HightLightSelect />
      <PropertiesGrid>
        <Suspense>
          <Home properties={properties} userEmail={userEmail} />
        </Suspense>
        <Suspense>
          <HomePage userEmail={userEmail} />
        </Suspense>
      </PropertiesGrid>
    </>
  );
}
