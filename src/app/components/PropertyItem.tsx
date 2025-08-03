"use client";

import Like from "./Like";
import PropertyFirstImage from "./PropertyFirstImage";
import Image from "next/image";
import Link from "next/link";
import { PropertyType } from "@/types/propertyType";
import { Suspense } from "react";

export default function PropertyItem({
  property,
  userEmail,
}: {
  property: PropertyType;
  userEmail: string | undefined | null;
}) {
  const { id, price, property_image, title, company } = property;

  return (
    <article className="group bg-white rounded-3xl">
      <div className="relative mb-1">
        <Link href={`/inmueble/${id}`} title={title}>
          <PropertyFirstImage
            title={title}
            src={property_image?.at(0)?.image_url}
          />
        </Link>
        <div className="opacity-0 group-hover:opacity-100 duration-300 transition-all invisible group-hover:visible absolute left-0 top-0 p-3">
          <Like propertyId={id} userEmail={userEmail} />
        </div>
      </div>
      <div className="p-3 sm:p-5 relative">
        {company ? (
          <Link
            href={`/empresa/${company.id}`}
            title={company.name}
            className="absolute -top-8 left-1/2 -translate-x-1/2"
          >
            <Image
              src={company.logo_url}
              className="object-cover rounded-full bg-gray-100"
              alt={company.name}
              title={company.name}
              width={50}
              height={50}
            />
          </Link>
        ) : null}
        <div className="w-full gap-4">
          <div className="flex items-center justify-between">
            <a
              title={title}
              href={`/inmueble/${id}`}
              className="font-bold text-xl mb-1"
            >
              $/. {price}
            </a>
            <Suspense>
              <Like
                propertyId={id}
                userEmail={userEmail}
                hasCounter
                hasBg={false}
                hasPadding={false}
              />
            </Suspense>
          </div>
          <h2 className="mb-1">
            <a
              title={title}
              href={`/inmueble/${id}`}
              className="w-full block font-semibold truncate"
            >
              {title}
            </a>
          </h2>
        </div>
      </div>
    </article>
  );
}
