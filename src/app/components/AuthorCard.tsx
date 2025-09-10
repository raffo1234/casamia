"use client";

import { supabase } from "@/lib/supabase";
import { CompanyType } from "@/types/companyType";
import { UserType } from "@/types/userType";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

const fetcher = async (authorId: string, isCompany: boolean) => {
  let query = supabase
    .from("property")
    .select("*", { count: "exact", head: true });

  if (isCompany) {
    query = query.eq("company_id", authorId);
  } else {
    query = query.eq("user_id", authorId).is("company_id", null);
  }

  const { count, error } = await query;

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
  const isCompany = !!company;
  const author = company ? company : user;
  const href = company ? `/empresa/${company.slug}` : `/usuario/${user?.slug}`;

  const {
    data: propertyCount,
    error,
    isLoading,
  } = useSWR(author?.id ? [author.id, isCompany] : null, ([id, isCompany]) =>
    fetcher(id, isCompany)
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
        <Link title={author.name} href={href} className="font-semibold mb-1">
          {author.name}
        </Link>
        <p className="text-slate-500">
          {isLoading ? (
            <div className="bg-slate-100 mt-1 animate-pulse rounded h-4 w-40"></div>
          ) : error ? (
            "Error al cargar inmuebles"
          ) : (
            `${propertyCount} Inmueble${propertyCount === 1 ? "" : "s"} publicado${
              propertyCount === 1 ? "" : "s"
            }`
          )}
        </p>
      </div>
    </div>
  );
}
