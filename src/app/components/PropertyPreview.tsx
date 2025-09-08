"use client";

import { Suspense, useCallback, useEffect, useRef } from "react";
import Property from "./Property";
import useSWR from "swr";
import { PropertyState } from "@/types/propertyState";
import { supabase } from "@/lib/supabase";
import { PropertyType } from "@/types/propertyType";
import { useParams, useRouter } from "next/navigation";
import RelatedProperties from "./RelatedProperties";
import Main from "./Main";

const fetcher = async (propertySlug: string) => {
  const { data } = (await supabase
    .from("property")
    .select(
      `
      id,
      title,
      slug,
      description,
      state,
      user_id,
      size,
      delivery_at,
      bathroom_count,
      phase,
      price,
      currency,
      location,
      google_map,
      bedroom_count,
      company_id,
      user!property_user_id_fkey (
        id,
        email,
        name,
        slug,
        image_url
      ),
      company!property_company_id_fkey (
        id,
        name,
        slug,
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
    .eq("slug", propertySlug)
    .order("created_at", { ascending: false })
    .single()) as { data: PropertyType | null };

  return data;
};

export default function PropertyPreview({
  userEmail,
}: {
  userEmail: string | undefined | null;
}) {
  const { slug } = useParams();
  const router = useRouter();
  const propertySlug = Array.isArray(slug) ? slug[0] : slug;

  const containerRef = useRef<HTMLDivElement>(null);

  const { data: property } = useSWR(propertySlug, () =>
    propertySlug ? fetcher(propertySlug) : null
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
    if (containerRef.current) {
      containerRef.current.focus();
    }
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          router.back();
        }
      }}
      onClick={handleOverlayClick}
      className="fixed top-0 left-0 z-30 w-full h-full overflow-auto transition-all duration-200 cursor-pointer bg-black/60 lg:p-6 bg-opacity-40"
    >
      <div className="animate-fade-in pb-20 cursor-default mx-auto relative lg:rounded-xl bg-white min-h-lvh">
        <Main>
          <Suspense>
            <Property property={property} userEmail={userEmail} />
          </Suspense>
          {property?.id ? (
            <Suspense>
              <RelatedProperties
                propertyId={property.id}
                userEmail={userEmail}
              />
            </Suspense>
          ) : null}
        </Main>
      </div>
      <button
        type="button"
        className="absolute bg-yellow-400 cursor-pointer p-3 transition-colors duration-300 rounded-full right-3 top-3 hover:bg-yellow-500"
        onClick={router.back}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 512 512"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32"
            d="M368 368L144 144m224 0L144 368"
          />
        </svg>
      </button>
    </div>
  );
}
