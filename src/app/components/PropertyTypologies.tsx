"use client";

import { supabase } from "@/lib/supabase";
import { Skeleton } from "antd";
import useSWR from "swr";
import { Icon } from "@iconify/react";
import DeletePropertyType from "./DeletePropertyType";
import Link from "next/link";
import EditLink from "./EditButton";
import Title from "./Title";
import HeaderTitle from "./HeaderTitle";
import BackButton from "./BackLink";
import PropertyAdminTabs from "./PropertyAdminTabs";
import FirstImage from "./FirstImage";

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

  if (isLoading) return <Skeleton />;

  return (
    <>
      <HeaderTitle>
        <Title>Tipologias</Title>
        <BackButton href={`/admin/property`}></BackButton>
      </HeaderTitle>
      <PropertyAdminTabs />
      <section
        key={propertyId}
        className="grid gap-8"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        }}
      >
        {types.map(
          ({
            id,
            name,
            size,
            floor,
            stock,
            bedroom_count,
            bathroom_count,
            typology_image,
          }) => {
            return (
              <div key={id}>
                <Link
                  href={`/admin/property/edit/${propertyId}/typologies/edit/${id}/images`}
                >
                  <FirstImage src={typology_image[0]?.image_url} title={name} />
                </Link>
                <div className="flex gap-2 item-center w-full justify-center">
                  <EditLink
                    href={`/admin/property/edit/${propertyId}/typologies/edit/${id}`}
                  />
                  <DeletePropertyType propertyId={propertyId} id={id} />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-xl font-light">
                    <p>{name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="material-symbols-light:bedroom-parent-outline"
                      className="text-2xl"
                    />
                    <p>
                      {size} m<sup>2</sup>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="material-symbols-light:bedroom-parent-outline"
                      className="text-2xl"
                    />
                    <p>Dormitorios: {bedroom_count}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="material-symbols-light:shower-outline"
                      className="text-2xl"
                    />
                    <p>Ba&ntilde;os: {bathroom_count}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="material-symbols-light:elevator-outline"
                      className="text-2xl"
                    />
                    <p>Piso: {floor}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="material-symbols-light:production-quantity-limits"
                      className="text-2xl"
                    />
                    <p>Disponibles: {stock}</p>
                  </div>
                </div>
              </div>
            );
          }
        )}
        <Link
          href={`/admin/property/edit/${propertyId}/typologies/add`}
          className="hover:bg-gray-200 transition-colors active:bg-gray-300 h-[260px] bg-gray-100 rounded-3xl flex justify-center items-center"
        >
          <Icon
            icon="material-symbols-light:add-2-rounded"
            className="text-3xl"
          />
        </Link>
      </section>
    </>
  );
}
