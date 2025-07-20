import PropertiesList from "@/components/PropertiesList";
import { auth } from "@/lib/auth";
import { propertyQuery } from "@/queries/property";
import { PropertyState } from "@/types/propertyState";
import { supabase } from "@/lib/supabase";
import PropertiesGrid from "@/components/PropertiesGrid";
import SearchForm from "@/components/SearchForm";
import HightLightSelect from "@/components/HighLightSelect";
import { Suspense } from "react";
import Home from "@/components/Home";

export default async function Index() {
  const session = await auth();
  const userEmail = session?.user?.email;

  const propertiesPromise = supabase
    .from("property")
    .select(propertyQuery)
    .eq("state", PropertyState.ACTIVE)
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <>
      <h1
        style={{
          fontSize: "clamp(16px, 6vw + .5rem, 50px)",
        }}
        className="mb-10 leading-tight w-full text-center"
      >
        Encuentra tu próximo <br /> hogar
      </h1>
      <SearchForm />
      <HightLightSelect />
      <PropertiesGrid>
        <Suspense>
          <Home propertiesPromise={propertiesPromise} />
        </Suspense>
        <PropertiesList userEmail={userEmail} />
      </PropertiesGrid>
    </>
  );
}
