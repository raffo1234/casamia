"use client";

import { supabase } from "@/lib/supabase";
import useSWR from "swr";
import { Suspense, useMemo } from "react";
import { useParams } from "next/navigation";
import ImageSliderFullScreen from "@/components/ImageSliderFullScreen";

const fetcher = async (propertyId: string) => {
  const { data, error } = await supabase
    .from("property_image")
    .select("id, image_url")
    .eq("property_id", propertyId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
};

export default function Page() {
  const params = useParams();
  const propertyId = params.id as string;

  const { data: images, isLoading } = useSWR(`${propertyId}-images`, () =>
    propertyId ? fetcher(propertyId) : null
  );

  const imagesToSlider = useMemo(
    () =>
      images?.map((image) => ({
        src: image.image_url,
        propertyId,
        propertyTitle: propertyId,
      })) || [],
    [images, propertyId]
  );

  if (isLoading) return "Cargando ...";

  return (
    <Suspense>
      <ImageSliderFullScreen images={imagesToSlider} />
    </Suspense>
  );
}
