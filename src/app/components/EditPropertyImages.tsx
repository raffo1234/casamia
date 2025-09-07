"use client";

import useSWR from "swr";
import AttachFiles from "./AttachFiles";
import ImagesEdition from "./ImagesEdition";
import { supabase } from "@/lib/supabase";
import GridAdminImages from "./GridAdminImages";

async function fetcher(propertyId: string) {
  const { data, error } = await supabase
    .from("property_image")
    .select("id, image_url, sort_order")
    .eq("property_id", propertyId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}

export default function EditPropertyImages({
  propertyId,
}: {
  propertyId: string;
}) {
  const { data: images, isLoading } = useSWR([propertyId, "images"], () =>
    fetcher(propertyId)
  );

  const buildHref = (index: number) => {
    return `/admin/property/edit/${propertyId}/images/slider/?imagen=${index}`;
  };

  return (
    <>
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
      {isLoading ? (
        <div className="flex p-7 flex-col gap-4 border border-gray-100 rounded-xl bg-white">
          <GridAdminImages>
            <div className="h-40 rounded-xl bg-gray-100 animate-pulse" />
            <div className="h-40 rounded-xl bg-gray-100 animate-pulse" />
            <div className="h-40 rounded-xl bg-gray-100 animate-pulse" />
          </GridAdminImages>
        </div>
      ) : null}
      {images && images.length > 0 ? (
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
            buildHref={buildHref}
            images={images}
          />
        </div>
      ) : null}
    </>
  );
}
