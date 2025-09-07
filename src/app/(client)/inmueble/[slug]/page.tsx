import Property from "@/components/Property";
import RelatedProperties from "@/components/RelatedProperties";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) {
    redirect("/404");
  }

  const [session, { data: property }] = await Promise.all([
    auth(),
    supabase
      .from("property")
      .select(
        `
        *,
        user:user!property_user_id_fkey (
          id,
          name,
          image_url
        ),
        company:company!property_company_id_fkey (
          id,
          name,
          logo_url
        ),
        typology (
          id,
          name,
          description,
          price,
          currency,
          size,
          stock,
          bathroom_count,
          bedroom_count
        )
      `
      )
      .eq("slug", slug)
      .single(),
  ]);

  if (!property) {
    redirect("/404");
  }

  const userEmail = session?.user?.email;

  return (
    <>
      <Property property={property} userEmail={userEmail} />
      <Suspense>
        <RelatedProperties propertyId={property.id} userEmail={userEmail} />
      </Suspense>
    </>
  );
}
