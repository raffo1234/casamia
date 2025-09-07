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
import { Suspense } from "react";

async function fetcher(id: string) {
  const { data, error } = await supabase
    .from("typology")
    .select(
      `
      *,
      typology_image!inner (
        id,
        image_url,
        sort_order
      )
    `
    )
    .eq("id", id)
    .order("sort_order", { ascending: true, referencedTable: "typology_image" })
    .single();

  if (error) throw error;
  return data;
}

export default function EditTypologyImages() {
  const params = useParams();
  const propertyId = params.id as string;
  const typologyId = params.typologyId as string;

  const { data: typology, isLoading } = useSWR([typologyId], () =>
    fetcher(typologyId)
  );

  const buildHref = (index: number) => {
    return `/admin/property/edit/${propertyId}/typologies/edit/${typologyId}/images/slider?imagen=${index}`;
  };

  if (!typologyId || (!isLoading && !typology)) {
    return <div>Tipología no encontrada.</div>;
  }

  return (
    <>
      <HeaderTitle>
        <Title>Typologia Imagenes</Title>
        <BackLink href={`/admin/property/edit/${propertyId}/typologies`} />
      </HeaderTitle>
      <Suspense>
        <TypologyAdminTabs />
      </Suspense>
      <div className="flex p-7 flex-col gap-4">
        <div className="flex p-7 flex-col gap-4 border border-gray-100 rounded-xl bg-white">
          <h2 className="font-semibold text-xl">
            Subir Imágenes <br />{" "}
            <span className="text-gray-400 text-sm font-normal">
              Las im&aacute;genes adjuntas serán parte de esta tipologia
            </span>
          </h2>
          <AttachFiles
            table="typology_image"
            parentColumnKey="typology_id"
            parentColumnValue={typologyId}
            keyPrefix="typology"
          />
        </div>
        {typology?.typology_image && typology.typology_image.length > 0 ? (
          <div className="flex p-7 flex-col gap-4 border border-gray-100 rounded-xl bg-white">
            <h2 className="font-semibold text-xl">
              Imágenes <br />
              <span className="text-gray-400 text-sm font-normal">
                Arrastra para cambiar
              </span>
            </h2>
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <ImagesEdition
                parentColumnKey="typology_id"
                parentColumnValue={typologyId}
                table="typology_image"
                buildHref={buildHref}
              />
            )}
          </div>
        ) : null}
      </div>
    </>
  );
}
