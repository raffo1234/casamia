"use client";

import useSWR from "swr";
import AttachFiles from "./AttachFiles";
import ImagesEdition from "./ImagesEdition";
import { supabase } from "@/lib/supabase";
import Title from "./Title";
import HeaderTitle from "./HeaderTitle";
import BackLink from "./BackLink";
import { useParams } from "next/navigation";
import TypologyAdminTabs from "./TypologyAdminTabs";

async function fetcher(id: string) {
  const { data, error } = await supabase
    .from("typology")
    .select("*, typology_image(id, image_url)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export default function EditTypologyImages() {
  const params = useParams();
  const propertyId = params.id as string;
  const typologyId = params.typologyId as string;

  const { data: typology, isLoading } = useSWR(typologyId, () =>
    fetcher(typologyId)
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <HeaderTitle>
        <Title>Typologia Imagenes</Title>
        <BackLink href={`/admin/property/edit/${propertyId}/typologies`} />
      </HeaderTitle>
      <TypologyAdminTabs />
      <div className="flex p-7 flex-col gap-4 border border-gray-100 rounded-xl bg-white">
        <h2 className="font-semibold text-xl">
          Subir Imágenes <br />{" "}
          <span className="text-gray-400 text-sm font-normal">
            Las im&aacute;genes adjuntas serán parte de este inmueble
          </span>
        </h2>
        <AttachFiles
          table="typology_image"
          parentColumnKey="typology_id"
          parentColumnValue={typologyId}
          keyPrefix="typology"
        />
      </div>
      {typology.typology_image.length > 0 ? (
        <div className="flex p-7 flex-col gap-4 border border-gray-100 rounded-xl bg-white">
          <h2 className="font-semibold text-xl">Imágenes</h2>
          <ImagesEdition
            parentColumnValue={typologyId}
            images={typology.typology_image}
            table="typology_image"
            parentSlugValue={typology.slug}
          />
        </div>
      ) : null}
    </>
  );
}
