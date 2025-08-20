"use client";

import ImageSliderFullScreen from "@/components/ImageSliderFullScreen";
import Spinner from "@/components/Spinner";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import useSWR from "swr";

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

  if (isLoading)
    return (
      <div className="items-center text-slate-400 flex justify-center w-full h-full bg-black fixed left-0 top-0 z-50">
        <Spinner size={48} />
      </div>
    );

  return (
    <Suspense>
      <ImageSliderFullScreen images={imagesToSlider} />
    </Suspense>
  );
}
