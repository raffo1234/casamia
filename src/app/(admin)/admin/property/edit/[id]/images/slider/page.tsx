"use client";

import { supabase } from "@/lib/supabase";
import useSWR from "swr";
import { Suspense, useMemo } from "react";
import { useParams } from "next/navigation";
import ImageSliderFullScreen from "@/components/ImageSliderFullScreen";

const fetcher = async (propertyId: string) => {
  const { data, error } = await supabase
    .from("property")
    .select(
      `
      id,
      slug,
      property_image(id, image_url)
    `
    )
    .eq("id", propertyId)
    .single();

  if (error) {
    console.error("Error fetching property and images:", error);
    throw error;
  }

  return data;
};

export default function Page() {
  const params = useParams();
  const propertyId = params.id as string;

  const { data: propertyData, isLoading } = useSWR(
    propertyId ? `${propertyId}-full-data` : null,
    () => fetcher(propertyId)
  );

  const imagesToSlider = useMemo(() => {
    if (!propertyData?.property_image) {
      return [];
    }

    return propertyData.property_image.map((image) => ({
      src: image.image_url,
      propertyId: propertyData.id,
      propertySlug: propertyData.slug,
      propertyTitle: propertyData.slug,
    }));
  }, [propertyData]);

  if (isLoading) {
    return "Cargando ...";
  }

  if (!propertyData) {
    return "Propiedad no encontrada.";
  }

  return (
    <Suspense>
      <ImageSliderFullScreen
        images={imagesToSlider}
        onClose={() => history.back()}
      />
    </Suspense>
  );
}
