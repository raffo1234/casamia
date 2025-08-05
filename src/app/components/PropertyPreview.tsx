"use client";

import { useCallback, useEffect } from "react";
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
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        router.back();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [router]);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div
      onClick={handleOverlayClick}
      className="animate-fade-in fixed top-0 left-0 z-30 w-full h-full overflow-auto transition-all duration-200 cursor-pointer bg-black/60 lg:p-6 bg-opacity-40"
    >
      <div className="animate-slide-up max-w-[1816px] py-20 px-4 cursor-default mx-auto relative lg:rounded-3xl bg-white min-h-lvh">
        <div className="mx-auto max-w-[1024px] w-full">
          <Property property={property} userEmail={userEmail} />
        </div>
        <button
          type="button"
          className="absolute p-3 transition-colors duration-300 rounded-full right-3 top-3 hover:text-cyan-400"
          onClick={router.back}
        >
          <Icon icon="solar:close-circle-broken" fontSize="42" />
        </button>
      </div>
    </div>
  );
}
