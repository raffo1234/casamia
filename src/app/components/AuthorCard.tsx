"use client";

import { supabase } from "@/lib/supabase";
import { CompanyType } from "@/types/companyType";
import { UserType } from "@/types/userType";
import Image from "next/image";
import useSWR from "swr";

const fetcher = async (userId: string) => {
  const { count, error } = await supabase
    .from("property")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return count;
};

export default function AuthorCard({
  user,
  company,
}: {
  user?: UserType | undefined | null;
  company?: CompanyType | undefined | null;
}) {
  const author = company ? company : user;
  const href = company ? `/empresa/${company.slug}` : `/usuario/${user?.slug}`;

  const {
    data: propertyCount,
    error,
    isLoading,
  } = useSWR(`user-count-${author?.id}`, () =>
    author ? fetcher(author.id) : null
  );

  if (!author) return null;

  return (
    <div className="flex text-[#1e0059] gap-4 text-sm">
      <a href={href} title={author.name}>
        <Image
          src={author.image_url}
          alt={author.name}
          className="rounded-full"
          height="60"
          width="60"
        />
      </a>
      <div>
        <p className="font-semibold mb-1">{author.name}</p>
        <p className="text-slate-500">
          {isLoading
            ? "Cargando..."
            : error
              ? "Error al cargar inmuebles"
              : `${propertyCount} Inmueble${propertyCount === 1 ? "" : "s"} publicado${
                  propertyCount === 1 ? "" : "s"
                }`}
        </p>
      </div>
    </div>
  );
}
