"use client";

import { useCallback, useEffect, useState } from "react";
import Property from "./Property";
import useSWR from "swr";
import { PropertyState } from "@/types/propertyState";
import { supabase } from "@/lib/supabase";
import { Icon } from "@iconify/react";
import { PropertyType } from "@/types/propertyType";
import { useParams, useRouter } from "next/navigation";

const fetcher = async (propertyId: string) => {
  const { data } = (await supabase
    .from("property")
    .select(
      `
      id,
      title,
      description,
      state,
      user_id,
      size,
      delivery_at,
      bathroom_count,
      phase,
      price,
      location,
      bedroom_count,
      company_id,
      user!property_user_id_fkey (
        id,
        email,
        name,
        image_url
      ),
      company!property_company_id_fkey (
        id,
        name,
        logo_url
      ),
      typology (
        id,
        name,
        description,
        price,
        size,
        stock,
        bathroom_count,
        bedroom_count
      )
    `
    )
    .eq("state", PropertyState.ACTIVE)
    .eq("id", propertyId)
    .order("created_at", { ascending: false })
    .single()) as { data: PropertyType | null };

  return data;
};

export default function PropertyPreview({
  userEmail,
}: {
  userEmail: string | undefined | null;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const { id } = useParams();
  const router = useRouter();
  const propertyId = Array.isArray(id) ? id[0] : id;

  const { data: property } = useSWR(propertyId, () =>
    propertyId ? fetcher(propertyId) : null
  );

  const handleOverlayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        router.back();
      }
    },
    [router]
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      onClick={handleOverlayClick}
      className="bg-black/60 fixed z-30 top-0 cursor-pointer left-0 w-full h-full overflow-auto lg:p-6 bg-opacity-40 transition-all duration-200"
    >
      <div
        className={`${
          isMounted ? "translate-y-0 opacity-100" : "translate-y-100 opacity-50"
        } transition-all duration-300 max-w-[1816px] py-20 px-4 animate-slideUp cursor-default mx-auto relative delay-50 transform-all lg:rounded-xl bg-white min-h-lvh`}
      >
        <div className="mx-auto max-w-[1024px] w-full">
          <Property property={property} userEmail={userEmail} />
        </div>
        <button
          type="button"
          className="absolute right-3 transition-colors duration-300 top-3 rounded-full p-3 hover:text-cyan-400"
          onClick={() => router.back()}
        >
          <Icon icon="solar:close-circle-broken" fontSize="42" />
        </button>
      </div>
    </div>
  );
}
