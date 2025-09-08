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
              <Icon icon="mdi:floor-plan" className="text-2xl text-[#F3B408]" />
              Area
            </div>
            <p className="text-sm">
              {size} m<sup>2</sup>
            </p>
          </div>
          <div className="flex items-center border border-slate-100 bg-slate-50 justify-between gap-2 px-6 py-2 rounded-xl">
            <div className="flex gap-2 items-center">
              <Icon
                icon="lucide:bed-double"
                className="text-2xl text-[#476CF6]"
              />
              Dormitorios
            </div>
            <p className="text-sm">{bedroom_count}</p>
          </div>
          <div className="flex items-center justify-between gap-2 px-6 py-2 border border-slate-100 bg-slate-50 rounded-xl">
            <div className="flex gap-2 items-center">
              <Icon
                icon="lucide-lab:shower"
                className="text-2xl text-[#2FCCCC]"
              />
              Ba&ntilde;os
            </div>
            <p className="text-sm">{bathroom_count}</p>
          </div>
          <div className="flex items-center justify-between gap-2 px-6 py-2 border border-slate-100 bg-slate-50 rounded-xl">
            <div className="flex gap-2 items-center">
              <Icon
                icon="carbon:skill-level"
                className="text-xl text-[#8C75FF]"
              />
              Pisos
            </div>
            <p className="text-sm truncate">{floor}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
