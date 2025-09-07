"use client";

import Typologies from "./Typologies";
import { Icon } from "@iconify/react";
import { PropertyPhase } from "@/types/propertyState";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Like from "./Like";
import GetInTouch from "./GetInTouch";
import PropertyImages from "./PropertyImages";
import Image from "next/image";
import { PropertyType } from "@/types/propertyType";
import { getFormattedPrice } from "@/lib/getFormattedPrice";
import Link from "next/link";
import New from "./New";
import { Suspense } from "react";

export default function Property({
  property,
  userEmail,
}: {
  property: PropertyType | null | undefined;
  userEmail: string | undefined | null;
}) {
  if (!property) return null;

  const {
    id,
    title,
    slug,
    bathroom_count,
    bedroom_count,
    phase,
    delivery_at,
    price,
    currency,
    location,
    google_map,
    company,
    created_at,
  } = property;

  return (
    <>
      {company ? (
        <div className="flex items-center justify-between w-full py-4 pr-20 bg-slate-100 lg:rounded-t-3xl">
          <div className="flex gap-3 items-center-safe">
            <span className="font-light">Por: </span>
            <Link
              href={`/empresa/${company.id}`}
              title={company.name}
              className="flex gap-3 text-lg items-center-safe"
            >
              <Image
                src={company.logo_url}
                alt={company.name}
                className="rounded-full"
                height="32"
                width="32"
              />
              <span className="transition-colors border-b-2 hover:border-slate-300 border-slate-400">
                {company.name}
              </span>
            </Link>
          </div>
          <GetInTouch
            propertyId={id}
            companyName={company.name}
            companyLogo={company.logo_url}
            propertyTitle={property.title}
          />
        </div>
      ) : null}
      <div className="sm:px-6 px-4 md:px-14 sm:pt-30 pt-12">
        <div className="lg:flex items-center-safe">
          <div className="mb-10 lg:w-1/2 lg:pr-20 lg:mb-0">
            <div className="mb-3">
              <New createdAt={created_at} />
            </div>
            <h1
              className="mb-8 leading-tight font-flaviotte"
              style={{
                fontSize: "clamp(16px, 6vw + .5rem, 63px)",
              }}
            >
              {title}
            </h1>
            <a
              title={location}
              target="_blank"
              href={google_map}
              style={{
                margin: "clamp(20px,5vw,35px) 0 clamp(40px,5vw,70px) 0",
              }}
              className="flex w-fit hover:text-slate-800 text-slate-600 gap-2 text-lg font-light uppercase"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 36 36"
              >
                <path
                  fill="currentColor"
                  d="M18 6.72a5.73 5.73 0 1 0 5.73 5.73A5.73 5.73 0 0 0 18 6.72m0 9.46a3.73 3.73 0 1 1 3.73-3.73A3.73 3.73 0 0 1 18 16.17Z"
                />
                <path
                  fill="currentColor"
                  d="M18 2A11.79 11.79 0 0 0 6.22 13.73c0 4.67 2.62 8.58 4.54 11.43l.35.52a100 100 0 0 0 6.14 8l.76.89l.76-.89a100 100 0 0 0 6.14-8l.35-.53c1.91-2.85 4.53-6.75 4.53-11.42A11.79 11.79 0 0 0 18 2m5.59 22l-.36.53c-1.72 2.58-4 5.47-5.23 6.9c-1.18-1.43-3.51-4.32-5.23-6.9l-.35-.53c-1.77-2.64-4.2-6.25-4.2-10.31a9.78 9.78 0 1 1 19.56 0c0 4.1-2.42 7.71-4.19 10.31"
                />
                <path fill="none" d="M0 0h36v36H0z" />
              </svg>
              {location}
            </a>
            <div className="border border-slate-500 rounded-xl">
              <div className="flex item-center">
                <div className="p-4 truncate flex-3 flex items-center justify-center text-xs border-b border-r rounded-tl-lg border-slate-500">
                  PRECIO
                </div>
                <div className="p-4 flex-1 flex justify-center items-center border-b border-r border-slate-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4m-8-6v6M2 18h20"
                    />
                  </svg>
                </div>
                <div className="flex-1 flex items-center justify-center p-4 border-b border-r border-slate-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    >
                      <path d="M9 10V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 10h14" />
                      <path d="M3 22V4a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v2m-4 8h.01M14 14h.01M18 14h.01M9 18h.01M14 18h.01M19 18h.01M8 22h.01M14 22h.01M20 22h.01" />
                    </g>
                  </svg>
                </div>
                <div className="truncate text-xs uppercase flex-1 justify-center flex items-center p-4 border-b rounded-tr-lg border-slate-500">
                  Entrega
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-3 truncate flex justify-center p-4 border-r font-semibold rounded-bl-lg border-slate-500">
                  {getFormattedPrice(currency, price)}
                </div>
                <div className="flex-1 flex justify-center p-4 border-r font-semibold border-slate-500">
                  {bedroom_count}
                </div>
                <div className="flex-1 flex justify-center p-4 border-r font-semibold border-slate-500">
                  {bathroom_count}
                </div>
                <div className="flex-1 px-4 py-2 flex justify-center font-semibold rounded-br-lg">
                  {phase === PropertyPhase.PLANOS ||
                  phase === PropertyPhase.CONSTRUCCION ? (
                    <div className="text-xs">
                      <div className="capitalize">
                        {delivery_at &&
                          format(new Date(delivery_at), "MMM, yyyy", {
                            locale: es,
                          })}
                      </div>
                    </div>
                  ) : (
                    <>{phase}</>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="relative lg:w-1/2">
            <div className="absolute top-3 left-3 md:left-15 z-10">
              <Suspense>
                <Like size={29} propertyId={id} userEmail={userEmail} />
              </Suspense>
            </div>
            <Suspense>
              <PropertyImages
                propertyTitle={title}
                propertyId={id}
                propertySlug={slug}
              />
            </Suspense>
          </div>
        </div>
        {property.description ? (
          <div className="pt-20">
            <h3 className="mb-6 text-sm text-slate-700">Conoce m&aacute;s</h3>
            <p className="whitespace-pre-line sm:text-2xl lg:text-3xl font-light leading-relaxed">
              {property.description}
            </p>
          </div>
        ) : null}
        <Suspense>
          <Typologies propertyId={property.id} />
        </Suspense>
      </div>
    </>
  );
}
