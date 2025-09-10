"use client";

import Typologies from "./Typologies";
import { PropertyPhase } from "@/types/propertyState";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Like from "./Like";
import PropertyImages from "./PropertyImages";
import { PropertyType } from "@/types/propertyType";
import { getFormattedPrice } from "@/lib/getFormattedPrice";
import New from "./New";
import { Suspense } from "react";
import AuthorLink from "./AuthorLink";
import H3 from "./H3";
import GetInTouch from "./GetInTouch";
import AuthorCard from "./AuthorCard";

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
    user,
    created_at,
  } = property;

  return (
    <div className="pt-20">
      <New createdAt={created_at} />
      <div className="mb-4">
        <h1
          className="text-[#1e0059] leading-tight font-inter-tight font-semibold"
          style={{
            fontSize: "clamp(16px, 6vw + .5rem, 52px)",
          }}
        >
          {title}
        </h1>
        <AuthorLink user={user} company={company} />
      </div>
      <div className="lg:flex gap-8">
        <div className="relative flex-grow-1">
          <div className="absolute top-3 left-3 z-10">
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
        <div className="mb-10 lg:w-[390px] flex flex-col gap-5 lg:mb-0">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-7">
            <p
              className="font-bold font-gilroy-medium"
              style={{
                fontSize: "clamp(16px, 6vw + .5rem, 28px)",
              }}
            >
              Desde {getFormattedPrice(currency, price)}
            </p>
            <a
              title={location}
              target="_blank"
              href={google_map}
              style={{
                margin: "clamp(20px,5vw,35px) 0 clamp(40px,5vw,70px) 0",
              }}
              className="flex w-fit hover:text-slate-800 text-slate-600 gap-2 text-sm font-light uppercase"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
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
            <div className="bg-white p-5 text-sm rounded-lg bgWhite flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
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
                  <p>Dormitorios</p>
                </div>
                <div>{bedroom_count}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
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
                  <p>Baños</p>
                </div>
                <div>{bathroom_count}</div>
              </div>
              <div className="flex justify-between capitalize items-center">
                <div className="flex gap-2 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M17 14a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2m-4-5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-6-3a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2"
                    />
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M7 1.75a.75.75 0 0 1 .75.75v.763c.662-.013 1.391-.013 2.193-.013h4.113c.803 0 1.532 0 2.194.013V2.5a.75.75 0 0 1 1.5 0v.827q.39.03.739.076c1.172.158 2.121.49 2.87 1.238c.748.749 1.08 1.698 1.238 2.87c.153 1.14.153 2.595.153 4.433v2.112c0 1.838 0 3.294-.153 4.433c-.158 1.172-.49 2.121-1.238 2.87c-.749.748-1.698 1.08-2.87 1.238c-1.14.153-2.595.153-4.433.153H9.945c-1.838 0-3.294 0-4.433-.153c-1.172-.158-2.121-.49-2.87-1.238c-.748-.749-1.08-1.698-1.238-2.87c-.153-1.14-.153-2.595-.153-4.433v-2.112c0-1.838 0-3.294.153-4.433c.158-1.172.49-2.121 1.238-2.87c.749-.748 1.698-1.08 2.87-1.238q.35-.046.739-.076V2.5A.75.75 0 0 1 7 1.75M5.71 4.89c-1.005.135-1.585.389-2.008.812S3.025 6.705 2.89 7.71q-.034.255-.058.539h18.336q-.024-.284-.058-.54c-.135-1.005-.389-1.585-.812-2.008s-1.003-.677-2.009-.812c-1.027-.138-2.382-.14-4.289-.14h-4c-1.907 0-3.261.002-4.29.14M2.75 12c0-.854 0-1.597.013-2.25h18.474c.013.653.013 1.396.013 2.25v2c0 1.907-.002 3.262-.14 4.29c-.135 1.005-.389 1.585-.812 2.008s-1.003.677-2.009.812c-1.027.138-2.382.14-4.289.14h-4c-1.907 0-3.261-.002-4.29-.14c-1.005-.135-1.585-.389-2.008-.812s-.677-1.003-.812-2.009c-.138-1.027-.14-2.382-.14-4.289z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p>Entrega</p>
                </div>
                <p>
                  {phase === PropertyPhase.PLANOS ||
                  phase === PropertyPhase.CONSTRUCCION
                    ? delivery_at &&
                      format(new Date(delivery_at), "MMMM, yyyy", {
                        locale: es,
                      })
                    : phase}
                </p>
              </div>
            </div>
            <GetInTouch
              propertyId={id}
              propertyTitle={title}
              user={user}
              company={company}
            />
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-7">
            <Suspense>
              <AuthorCard user={user} company={company} />
            </Suspense>
          </div>
        </div>
      </div>
      {property.description ? (
        <div className="pt-20">
          <H3>Conoce m&aacute;s</H3>
          <p className="whitespace-pre-line sm:text-2xl lg:text-3xl font-light leading-relaxed">
            {property.description}
          </p>
        </div>
      ) : null}
      <Suspense>
        <Typologies propertyId={property.id} />
      </Suspense>
    </div>
  );
}
