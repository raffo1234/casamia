"use client";

import ImageSliderFullScreen from "@/components/ImageSliderFullScreen";
import Spinner from "@/components/Spinner";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import useSWR from "swr";

const fetcherImages = async (propertyId: string) => {
  if (!propertyId) return null;
  const { data, error } = await supabase
    .from("property_image")
    .select("id, image_url")
    .eq("property_id", propertyId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data;
};

const fetcherProperty = async (propertySlug: string) => {
  if (!propertySlug) return null;
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

  const { data: property, isLoading: isLoadingProperty } = useSWR(
    propertySlug ? `property-by-slug-${propertySlug}` : null,
    () => fetcherProperty(propertySlug),
  );

  const { data: images, isLoading: isLoadingImages } = useSWR(
    property?.id ? `images-for-${property.id}` : null,
    () => fetcherImages(property?.id),
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

  if (isLoadingProperty || isLoadingImages || !property)
    return (
      <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black text-slate-400">
        <Spinner size={48} />
      </div>
    );

  return (
    <Suspense>
      <ImageSliderFullScreen images={imagesToSlider} onClose={() => history.back()} />
    </Suspense>
  );
}
