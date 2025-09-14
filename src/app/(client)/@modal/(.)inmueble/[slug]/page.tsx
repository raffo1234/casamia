import PropertyPreview from "@/components/PropertyPreview";
import RelatedProperties from "@/components/RelatedProperties";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { PropertyState } from "@/types/propertyState";
import { PropertyType } from "@/types/propertyType";
import { notFound } from "next/navigation";
import { Suspense } from "react";

async function fetchProperty(propertySlug: string) {
  const { data } = (await supabase
    .from("property")
    .select(
      `
      id,
      title,
      slug,
      description,
      state,
      user_id,
      size,
      delivery_at,
      bathroom_count,
      phase,
      price,
      currency,
      location,
      google_map,
      bedroom_count,
      company_id,
      user!property_user_id_fkey (
        id,
        email,
        first_name,
        last_name,
        slug,
        image_url
      ),
      company!property_company_id_fkey (
        id,
        name,
        slug,
        logo_url
      ),
      typology (
        id,
        name,
        description,
        price,
        size,
        stock,
        bathroom_count,
        bedroom_count
      )
    `,
    )
    .eq("state", PropertyState.ACTIVE)
    .eq("slug", propertySlug)
    .single()) as { data: PropertyType | null };

  if (!data) {
    notFound();
  }

  return data;
}

type Params = Promise<{ slug: string }>;

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const session = await auth();
  const userEmail = session?.user?.email;
  const property = await fetchProperty(slug);

  return (
    <>
      <PropertyPreview property={property} userEmail={userEmail} />
      <Suspense>
        <RelatedProperties propertyId={property.id} userEmail={userEmail} />
      </Suspense>
    </>
  );
}
