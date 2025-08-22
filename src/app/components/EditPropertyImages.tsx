"use client";

import { getAdminPropertiesUserKey } from "@/constants";
import useSWR, { mutate } from "swr";
import AttachFiles from "./AttachFiles";
import PropertyImagesEdition from "./PropertyImagesEdition";
import { supabase } from "@/lib/supabase";

async function fetcher(id: string) {
  const { data, error } = await supabase
    .from("property")
    .select("*, property_image(id, image_url)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export default function EditPropertyImages({
  userId,
  propertyId,
}: {
  userId: string;
  propertyId: string;
}) {
  const mutateAdminProperties = () => {
    mutate(() => getAdminPropertiesUserKey(userId));
  };

  const {
    data: property,

    isLoading,
    mutate: mutateProperty,
  } = useSWR(propertyId, () => fetcher(propertyId));

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="flex p-7 flex-col gap-4 border border-gray-100 rounded-xl bg-white">
        <h2 className="font-semibold text-xl">
          Subir Imágenes <br />{" "}
          <span className="text-gray-400 text-sm font-normal">
            Las im&aacute;genes adjuntas serán parte de este inmueble
          </span>
        </h2>
        <AttachFiles
          propertyId={propertyId}
          mutateFiles={mutateAdminProperties}
        />
      </div>
      {property.property_image.length > 0 ? (
        <div className="flex p-7 flex-col gap-4 border border-gray-100 rounded-xl bg-white">
          <h2 className="font-semibold text-xl">Imágenes</h2>
          <PropertyImagesEdition
            userId={userId}
            propertyImages={property.property_image}
            mutateProperty={mutateProperty}
          />
        </div>
      ) : null}
    </>
  );
}
