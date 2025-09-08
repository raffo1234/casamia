"use client";

import { supabase } from "@/lib/supabase";
import useSWR from "swr";
import ImageSlider from "./ImageSlider";
import { useMemo } from "react";

const fetcher = async (propertyId: string) => {
  const { data, error } = await supabase
    .from("property_image")
    .select("id, image_url")
    .eq("property_id", propertyId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data;
};

export default function PropertyImages({
  propertyId,
  propertySlug,
  propertyTitle,
}: {
  propertyId: string;
  propertySlug: string;
  propertyTitle: string;
}) {
  const { data: images, isLoading } = useSWR(`${propertyId}-images`, () =>
    fetcher(propertyId)
  );

  const imagesToSlider = useMemo(
    () =>
      images?.map((image) => ({
        src: image.image_url,
        propertyId,
        propertySlug,
        propertyTitle,
      })) || [],
    [images, propertyId, propertySlug, propertyTitle]
  );

  if (isLoading) {
    return (
      <div className="animate-pulse aspect-5/4 rounded-xl bg-slate-100 h-full w-full"></div>
    );
  }

  return <ImageSlider images={imagesToSlider} />;
}
