"use client";

import Like from "./Like";
import FirstImage from "./FirstImage";
import Image from "next/image";
import Link from "next/link";
import { PropertyType } from "@/types/propertyType";
import { Suspense } from "react";
import { getFormattedPrice } from "@/lib/getFormattedPrice";

export default function PropertyCard({
  property,
  userEmail,
}: {
  property: PropertyType;
  userEmail: string | undefined | null;
}) {
  const { id, slug, price, currency, user, property_image, title, company } =
    property;

  return (
    <article className="group bg-slate-50 border border-slate-100 overflow-hidden rounded-3xl">
      <div className="relative overflow-hidden mb-1">
        <Link href={`/inmueble/${slug}`} title={title}>
          <FirstImage title={title} src={property_image?.at(0)?.image_url} />
        </Link>
        <div className="md:opacity-0 group-hover:opacity-100 duration-300 transition-all sm:invisible group-hover:visible absolute left-0 top-0 p-3">
          <Suspense>
            <Like size={20} propertyId={id} userEmail={userEmail} />
          </Suspense>
        </div>
      </div>
      <div className="p-3 sm:p-5 sm:pt-7 relative">
        {company ? (
          <Link
            href={`/empresa/${company.slug}`}
            title={company.name}
            className="absolute -top-8 left-1/2 -translate-x-1/2"
          >
            <Image
              src={company.logo_url}
              className="w-15 h-15 sm:w-13 sm:h-13 object-cover rounded-full bg-gray-100"
              alt={company.name}
              title={company.name}
              width={52}
              height={52}
            />
          </Link>
        ) : user ? (
          <Link
            href={`/usuario/${user?.slug}`}
            title={user?.name}
            className="absolute -top-8 left-1/2 -translate-x-1/2"
          >
            <Image
              src={user?.image_url}
              className="w-15 h-15 sm:w-13 sm:h-13 object-cover rounded-full bg-gray-100"
              alt={user?.name}
              title={user?.name}
              width={52}
              height={52}
            />
          </Link>
        ) : null}
        <div className="w-full gap-4">
          <div className="flex items-center justify-between mb-2">
            <Link
              href={`/inmueble/${id}`}
              title={title}
              className="font-semibold font-gilroy-medium text-xl"
            >
              {getFormattedPrice(currency, price)}
            </Link>
            <Suspense>
              <Like
                size={20}
                propertyId={id}
                userEmail={userEmail}
                hasCounter
                hasBg={false}
                hasPadding={false}
              />
            </Suspense>
          </div>
          <h2 className="mb-1">
            <Link
              title={title}
              href={`/inmueble/${id}`}
              className="w-full block truncate text-sm text-gray-400 font-light"
            >
              {title}
            </Link>
          </h2>
        </div>
      </div>
    </article>
  );
}
