"use client";

import { supabase } from "@/lib/supabase";
import useSWR from "swr";
import { Suspense, useMemo } from "react";
import { useParams } from "next/navigation";
import ImageSliderFullScreen from "@/components/ImageSliderFullScreen";

const fetcher = async (typologyId: string) => {
  const { data, error } = await supabase
    .from("typology")
    .select(
      `
      id,
      slug,
      typology_image(id, image_url)
    `
    )
    .eq("id", typologyId)
    .single();

  if (error) {
    console.error("Error fetching property and images:", error);
    throw error;
  }

  return data;
};

export default function Page() {
  const params = useParams();
  const typologyId = params.typologyId as string;
  console.log({ typologyId });
  const { data: typologyData, isLoading } = useSWR(
    typologyId ? `${typologyId}-full-data` : null,
    () => fetcher(typologyId)
  );

  const imagesToSlider = useMemo(() => {
    if (!typologyData?.typology_image) {
      return [];
    }

    return typologyData.typology_image.map((image) => ({
      src: image.image_url,
      propertyId: typologyData.id,
      propertySlug: typologyData.slug,
      propertyTitle: typologyData.slug,
    }));
  }, [typologyData]);

  if (isLoading) {
    return "Cargando ...";
  }

  if (!typologyData) {
    return "Typologia no encontrada.";
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
