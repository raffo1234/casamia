"use client";

import { supabase } from "@/lib/supabase";
import useSWR from "swr";
import { Suspense, useMemo } from "react";
import { useParams } from "next/navigation";
import ImageSliderFullScreen from "@/components/ImageSliderFullScreen";

const fetcherImages = async (propertyId: string) => {
  const { data, error } = await supabase
    .from("property_image")
    .select("id, image_url")
    .eq("property_id", propertyId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data;
};

const fetcherProperty = async (propertySlug: string) => {
  const { data, error } = await supabase
    .from("property")
    .select("id")
    .eq("slug", propertySlug)
    .order("created_at", { ascending: true })
    .single();
  if (error) throw error;
  return data;
};

export default function Page() {
  const params = useParams();
  const propertySlug = params.slug as string;

  const { data: property, isLoading: isLoadingProperty } = useSWR(`${propertySlug}-property`, () =>
    propertySlug ? fetcherProperty(propertySlug) : null,
  );

  const { data: images, isLoading: isLoadingImages } = useSWR(`${property?.id}-images`, () =>
    property ? fetcherImages(property.id) : null,
  );

  const imagesToSlider = useMemo(
    () =>
      images?.map((image) => ({
        src: image.image_url,
        propertySlug,
        propertyTitle: propertySlug,
      })) || [],
    [images, propertySlug],
  );

  if (isLoadingProperty || isLoadingImages) return "Cargando ...";

  return (
    <Suspense>
      <ImageSliderFullScreen images={imagesToSlider} onClose={() => history.back()} />
    </Suspense>
  );
}
