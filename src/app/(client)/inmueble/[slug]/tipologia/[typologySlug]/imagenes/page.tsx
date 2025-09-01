"use client";

import { supabase } from "@/lib/supabase";
import useSWR from "swr";
import { Suspense, useMemo } from "react";
import { useParams } from "next/navigation";
import ImageSliderFullScreen from "@/components/ImageSliderFullScreen";

const fetcherImages = async (id: string) => {
  const { data, error } = await supabase
    .from("typology_image")
    .select("id, image_url")
    .eq("typology_id", id)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data;
};

const fetcherTypology = async (slug: string) => {
  const { data, error } = await supabase
    .from("typology")
    .select("id, name")
    .eq("slug", slug)
    .order("created_at", { ascending: true })
    .single();
  if (error) throw error;
  return data;
};

export default function Page() {
  const params = useParams();
  const typologySlug = params.typologySlug as string;

  const { data: typology, isLoading: isLoading } = useSWR(
    `${typologySlug}-typology`,
    () => (typologySlug ? fetcherTypology(typologySlug) : null)
  );

  const { data: images, isLoading: isLoadingImages } = useSWR(
    `${typology?.id}-images`,
    () => (typology ? fetcherImages(typology.id) : null)
  );

  const imagesToSlider = useMemo(
    () =>
      images?.map((image) => ({
        src: image.image_url,
        propertySlug: typologySlug,
        propertyTitle: typology?.name,
      })) || [],
    [images, typology?.name, typologySlug]
  );
  
  if (isLoading || isLoadingImages)
    return <div className="fixed h-full w-full top-0 left-0 bg-black z-50" />;

  return (
    <Suspense>
      <ImageSliderFullScreen
        images={imagesToSlider}
        onClose={() => history.back()}
      />
    </Suspense>
  );
}
