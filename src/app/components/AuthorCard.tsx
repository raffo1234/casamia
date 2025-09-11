"use client";

import { supabase } from "@/lib/supabase";
import { CompanyType } from "@/types/companyType";
import { UserType } from "@/types/userType";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

const fetcher = async (authorId: string, isCompany: boolean) => {
  let query = supabase.from("property").select("*", { count: "exact", head: true });

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
  user?: UserType | null;
  company?: CompanyType | null;
}) {
  const isCompany = !!company;
  const author = isCompany ? company : user;

  const href = isCompany ? `/empresa/${company.slug}` : `/usuario/${user?.slug}`;
  const authorName = isCompany ? company.name : `${user?.first_name} ${user?.last_name}`;
  const authorImage = isCompany ? company.image_url : user?.image_url;

  const {
    data: propertyCount,
    error,
    isLoading,
  } = useSWR(author?.id ? [author.id, isCompany] : null, ([id, isCompany]) =>
    fetcher(id, isCompany),
  );

  return (
    <div className="flex text-[#1e0059] gap-4 text-sm">
      <Link href={href}>
        <Image
          src={authorImage || "/default-avatar.png"}
          alt={authorName}
          className="rounded-full"
          height={60}
          width={60}
        />
      </Link>
      <div>
        <Link title={authorName} href={href} className="font-semibold mb-1">
          {authorName}
        </Link>
        <p className="text-slate-500">
          {isLoading ? (
            <span className="bg-slate-100 mt-1 animate-pulse rounded h-4 w-40"></span>
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
