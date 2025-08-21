"use client";

import { supabase } from "@/lib/supabase";
import useSWR from "swr";
import TypologiesGrid from "./TypologiesGrid";
import { Icon } from "@iconify/react";
import Image from "next/image";

type Typology = {
  id: string;
  name: string;
  description: string;
  size: string;
  price: string;
  bathroom_count: string;
  bedroom_count: string;
  floor: string;
  stock: string;
};

const fetcher = async (propertyId: string) => {
  const { data, error } = await supabase
    .from("typology")
    .select("*")
    .eq("property_id", propertyId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
};

function Typology({ typology }: { typology: Typology }) {
  const { name, id, size, bedroom_count, bathroom_count, price, floor } =
    typology;
  return (
    <article key={id} className="relative mb-4">
      <button className="relative block w-full">
        <Image
          src="https://fastly.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI"
          className="w-full object-cover aspect-[4/3] rounded-3xl mb-4 relative"
          alt={name}
          width={400}
          height={300}
        />
      </button>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 mb-3">
          <p className="text-xl font-light">{name}</p>
        </div>
        <div className="justify-center flex items-center p-3 bg-orange-100 rounded-md">
          <p className="font-semibold">S/. {price}</p>
        </div>
        <div
          className="grid gap-1 rounded-md"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          }}
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md">
            <Icon icon="mdi:floor-plan" className="text-2xl text-[#F3B408]" />
            <p className="text-sm">
              {size} m<sup>2</sup>
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md">
            <Icon
              icon="lucide:bed-double"
              className="text-2xl text-[#476CF6]"
            />
            <p className="text-sm">{bedroom_count} Dorms.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md">
            <Icon
              icon="lucide-lab:shower"
              className="text-2xl text-[#2FCCCC]"
            />
            <p className="text-sm">{bathroom_count} Ba&ntilde;os</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md">
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
  const { data: typologies = [] } = useSWR(`${propertyId}-typologies`, () =>
    fetcher(propertyId)
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
