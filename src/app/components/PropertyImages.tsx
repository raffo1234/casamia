"use client";

import { Icon } from "@iconify/react";
import { supabase } from "@/lib/supabase";
import useSWR from "swr";
import Image from "next/image";
import ImageSlider from "./ImageSlider";
import { useMemo } from "react";
import Link from "next/link";

const fetcher = async (propertyId: string) => {
  const { data, error } = await supabase
    .from("property_image")
    .select("id, image_url")
    .eq("property_id", propertyId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
};

export default function PropertyImages({
  propertyId,
  propertyTitle,
}: {
  propertyId: string;
  propertyTitle: string;
}) {
  const { data: images, isLoading } = useSWR(`${propertyId}-images`, () =>
    fetcher(propertyId)
  );
  const imageClassName = "w-full aspect-[5/4] object-cover rounded-3xl";

  const imagesToSlider = useMemo(
    () =>
      images?.map((image) => ({
        src: image.image_url,
        propertyId: propertyId,
      })) || [],
    [images, propertyId]
  );

  return (
    <div className="relative w-full">
      {images?.length === 0 || isLoading ? (
        <div
          className={`${imageClassName} ${
            images?.length === 0 || isLoading ? "opacity-100" : "opacity-0"
          } absolute left-0 top-0 h-full transition-opacity duration-500 bg-gray-100 rounded-xl w-full aspect-[5/4] flex justify-center items-center`}
        >
          <Icon
            icon="solar:gallery-broken"
            fontSize={64}
            className="text-gray-400"
          />
        </div>
      ) : null}
      {images?.length === 1 ? (
        <Link
          href={`/inmueble/${propertyId}/imagenes`}
          className="w-full aspect-5/4 mx-auto cursor-pointer"
        >
          <Image
            src={images[0].image_url}
            alt={propertyTitle}
            title={propertyTitle}
            loading="lazy"
            className={imageClassName}
            priority={false}
            quality={70}
            width={500}
            height={400}
          />
        </Link>
      ) : (
        <ImageSlider images={imagesToSlider} />
      )}
    </div>
  );
}
