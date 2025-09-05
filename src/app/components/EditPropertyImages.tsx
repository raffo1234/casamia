"use client";

import useSWR from "swr";
import AttachFiles from "./AttachFiles";
import ImagesEdition from "./ImagesEdition";
import { supabase } from "@/lib/supabase";
import PropertyAdminTabs from "./PropertyAdminTabs";
import Title from "./Title";
import HeaderTitle from "./HeaderTitle";
import BackLink from "./BackLink";
import { Suspense } from "react";

async function fetcher(id: string) {
  const { data, error } = await supabase
    .from("property")
    .select(
      `
      *,
      property_image!inner (
        id,
        image_url,
        sort_order
      )
    `
    )
    .eq("id", id)
    .order("sort_order", { ascending: true, referencedTable: "property_image" })
    .single();

  if (error) throw error;
  return data;
}

export default function EditPropertyImages({
  propertyId,
}: {
  propertyId: string;
}) {
  const { data: property, isLoading } = useSWR(propertyId, () =>
    fetcher(propertyId)
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <HeaderTitle>
        <Title>Imagenes</Title>
        <BackLink href={`/admin/property/edit/${propertyId}`} />
      </HeaderTitle>
      <Suspense>
        <PropertyAdminTabs />
      </Suspense>
      <div className="flex p-7 mb-6 flex-col gap-4 border border-gray-100 rounded-xl bg-white">
        <h2 className="font-semibold text-xl">
          Subir Imágenes <br />{" "}
          <span className="text-gray-400 text-sm font-normal">
            Las im&aacute;genes adjuntas serán parte de este inmueble
          </span>
        </h2>
        <AttachFiles
          table="property_image"
          parentColumnKey="property_id"
          parentColumnValue={propertyId}
          keyPrefix="property"
        />
      </div>
      {property.property_image.length > 0 ? (
        <div className="flex p-7 flex-col gap-4 border border-gray-100 rounded-xl bg-white">
          <h2 className="font-semibold text-xl">
            Imágenes <br />
            <span className="text-gray-400 text-sm font-normal">
              Arrastra para cambiar
            </span>
          </h2>
          <ImagesEdition
            parentColumnKey="property_id"
            parentColumnValue={propertyId}
            table="property_image"
            parentSlugValue={property.slug}
          />
        </div>
      ) : null}
    </>
  );
}
