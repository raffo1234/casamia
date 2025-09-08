"use client";

import { supabase } from "@/lib/supabase";
import useSWR from "swr";
import { Icon } from "@iconify/react";
import DeletePropertyType from "./DeletePropertyType";
import Link from "next/link";
import EditLink from "./EditButton";
import FirstImage from "./FirstImage";
import PropertiesAdminGrid from "./PropertiesAdminGrid";

const fetcherType = async (propertyId: string) => {
  const { data, error } = await supabase
    .from("typology")
    .select(
      `
      id,
      property_id,
      name,
      bathroom_count,
      bedroom_count,
      price,
      size,
      floor,
      stock,
      typology_image(id, image_url)
    `
    )
    .eq("property_id", propertyId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
};

export default function PropertyTypologies({
  propertyId,
}: {
  propertyId: string;
}) {
  const { data: types = [], isLoading } = useSWR(
    `${propertyId}-typology-with-images`,
    () => fetcherType(propertyId)
  );

  return (
    <>
      {isLoading ? (
        <PropertiesAdminGrid>
          <div className="h-[260px] bg-slate-100 animate-pulse rounded-3xl "></div>
          <div className="h-[260px] bg-slate-100 animate-pulse rounded-3xl "></div>
          <div className="h-[260px] bg-slate-100 animate-pulse rounded-3xl "></div>
        </PropertiesAdminGrid>
      ) : (
        <PropertiesAdminGrid key={propertyId}>
          {types.map(({ id, name, typology_image }) => {
            return (
              <div key={id} className="rounded-3xl overflow-hidden">
                <Link
                  href={`/admin/property/edit/${propertyId}/typologies/edit/${id}/images`}
                >
                  <FirstImage src={typology_image[0]?.image_url} title={name} />
                </Link>
                <div className="bg-white border-x px-4 border-b py-5 border-slate-100">
                  <h2 className="mb-5 text-xl line-clamp-1">
                    <p>{name}</p>
                  </h2>
                  <div className="flex gap-2 item-center w-full justify-center">
                    <EditLink
                      href={`/admin/property/edit/${propertyId}/typologies/edit/${id}`}
                    />
                    <DeletePropertyType propertyId={propertyId} id={id} />
                  </div>
                </div>
              </div>
            );
          })}
          <Link
            href={`/admin/property/edit/${propertyId}/typologies/add`}
            className="hover:bg-gray-200 min-h-30 transition-colors active:bg-gray-300 h-[260px] bg-gray-100 rounded-3xl flex justify-center items-center"
          >
            <Icon
              icon="material-symbols-light:add-2-rounded"
              className="text-3xl"
            />
          </Link>
        </PropertiesAdminGrid>
      )}
    </>
  );
}
