"use client";

import { supabase } from "@/lib/supabase";
import useSWR from "swr";
import TypologiesGrid from "./TypologiesGrid";
import { Icon } from "@iconify/react";
import FirstImage from "./FirstImage";
import { TypologyType } from "@/types/TypologyType";
import { getFormattedPrice } from "@/lib/getFormattedPrice";

const fetcher = async (propertyId: string) => {
  const { data, error } = await supabase
    .from("typology")
    .select("*, typology_image(id, image_url)")
    .eq("property_id", propertyId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
};

function Typology({ typology }: { typology: TypologyType }) {
  const { name, id, currency, size, bedroom_count, bathroom_count, price, floor } =
    typology;

  return (
    <article key={id} className="relative mb-4">
      <FirstImage src={typology.typology_image[0]?.image_url} title={name} />
      <div className="flex flex-col gap-0.5">
        <p className="text-xl font-light my-4">{name}</p>
        <div className="justify-center flex items-center p-3 bg-cyan-50 rounded-b-3xl">
          <p className="font-semibold text-2xl font-gilroy-bold"> {getFormattedPrice(currency, price)}</p>
        </div>
        <div
          className="grid gap-0.5 rounded-md"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          }}
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl">
            <Icon icon="mdi:floor-plan" className="text-2xl text-[#F3B408]" />
            <p className="text-sm">
              {size} m<sup>2</sup>
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl">
            <Icon
              icon="lucide:bed-double"
              className="text-2xl text-[#476CF6]"
            />
            <p className="text-sm">{bedroom_count} Dorms.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl">
            <Icon
              icon="lucide-lab:shower"
              className="text-2xl text-[#2FCCCC]"
            />
            <p className="text-sm">{bathroom_count} Ba&ntilde;os</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl">
            <Icon
              icon="carbon:skill-level"
              className="text-xl text-[#8C75FF]"
            />
            <p className="text-sm">Pisos: {floor}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Typologies({ propertyId }: { propertyId: string }) {
  const { data: typologies = [] } = useSWR(
    `${propertyId}-typology-with-images`,
    () => fetcher(propertyId)
  );

  return typologies.length > 0 ? (
    <div className="mt-20 md:mt-30">
      <h3 className="mb-6 text-sm text-slate-700">
        Encuentra tu modelo ideal:
      </h3>
      <TypologiesGrid>
        {typologies.map((typology) => {
          return <Typology key={typology.id} typology={typology} />;
        })}
      </TypologiesGrid>
    </div>
  ) : null;
}
