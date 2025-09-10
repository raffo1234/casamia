import { Icon } from "@iconify/react";
import FirstImage from "./FirstImage";
import { TypologyType } from "@/types/TypologyType";
import { getFormattedPrice } from "@/lib/getFormattedPrice";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function TypologyCard({ typology }: { typology: TypologyType }) {
  const {
    name,
    id,
    slug,
    currency,
    size,
    bedroom_count,
    bathroom_count,
    price,
    floor,
  } = typology;

  const params = useParams();
  const propertySlug = params.slug as string;

  return (
    <article key={id} className="relative mb-4">
      <Link
        href={`/inmueble/${propertySlug}/tipologia/${slug}/imagenes`}
        className="rounded-3xl block overflow-hidden"
      >
        <FirstImage src={typology.typology_image[0]?.image_url} title={name} />
      </Link>
      <div className="flex flex-col gap-0.5">
        <p className="text-xl font-inter-tight font-bold my-4">{name}</p>
        <p className="p-3 bg-cyan-50 rounded-3xl text-center font-semibold text-2xl font-gilroy-bold">
          {getFormattedPrice(currency, price)}
        </p>
        <div
          className="text-sm flex flex-col gap-0.5 rounded-md"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          }}
        >
          <div className="flex items-center justify-between gap-2 px-6 py-2 border border-slate-100 bg-slate-50 rounded-xl">
            <div className="flex gap-2 items-center">
              <svg
                className="text-2xl text-amber-400"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M10 5v5H9V5H5v8h4v-1h1v5H9v-3H5v5h7v-2h1v2h6v-2h2v4H3V3h18v12h-2v-5h-6v5h-1V9h7V5z"
                />
              </svg>
              Area
            </div>
            <p className="text-sm">
              {size} m<sup>2</sup>
            </p>
          </div>
          <div className="flex items-center border border-slate-100 bg-slate-50 justify-between gap-2 px-6 py-2 rounded-xl">
            <div className="flex gap-2 items-center">
              <svg
                className="text-2xl text-cyan-400"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4m-8-6v6M2 18h20"
                />
              </svg>
              Dormitorios
            </div>
            <p className="text-sm">{bedroom_count}</p>
          </div>
          <div className="flex items-center justify-between gap-2 px-6 py-2 border border-slate-100 bg-slate-50 rounded-xl">
            <div className="flex gap-2 items-center">
              <svg
                className="text-2xl text-green-300"
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
              Ba&ntilde;os
            </div>
            <p className="text-sm">{bathroom_count}</p>
          </div>
          <div className="flex items-center justify-between gap-2 px-6 py-2 border border-slate-100 bg-slate-50 rounded-xl">
            <div className="flex gap-2 items-center">
              <svg
                className="text-xl text-[#8C75FF]"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 32 32"
              >
                <path
                  fill="currentColor"
                  d="M30 30h-8V4h8zm-6-2h4V6h-4zm-4 2h-8V12h8zm-6-2h4V14h-4zm-4 2H2V18h8zm-6-2h4v-8H4z"
                />
              </svg>
              Pisos
            </div>
            <p className="text-sm truncate">{floor}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
