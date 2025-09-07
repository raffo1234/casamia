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
import GridAdminImages from "./GridAdminImages";

async function fetcher(typologyId: string) {
  const { data, error } = await supabase
    .from("typology_image")
    .select("id, image_url, sort_order")
    .eq("typology_id", typologyId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}

export default function EditTypologyImages() {
  const params = useParams();
  const propertyId = params.id as string;
  const typologyId = params.typologyId as string;

  const { data: images, isLoading } = useSWR([typologyId, "images"], () =>
    fetcher(typologyId)
  );

  const buildHref = (index: number) => {
    return `/admin/property/edit/${propertyId}/typologies/edit/${typologyId}/images/slider?imagen=${index}`;
  };

  if (!typologyId) {
    return <div>Tipología no encontrada.</div>;
  }

  return (
    <>
      <HeaderTitle>
        <Title>Typologia Imagenes</Title>
        <BackLink href={`/admin/property/edit/${propertyId}/typologies`} />
      </HeaderTitle>
      <TypologyAdminTabs />
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
        {isLoading ? (
          <div className="flex p-7 flex-col gap-4 border border-gray-100 rounded-xl bg-white">
            <GridAdminImages>
              <div className="h-40 rounded-xl bg-gray-100 animate-pulse" />
              <div className="h-40 rounded-xl bg-gray-100 animate-pulse" />
              <div className="h-40 rounded-xl bg-gray-100 animate-pulse" />
            </GridAdminImages>
          </div>
        ) : null}
        {images && images.length > 0 ? (
          <div className="flex p-7 flex-col gap-4 border border-gray-100 rounded-xl bg-white">
            <h2 className="font-semibold text-xl">
              Imágenes <br />
              <span className="text-gray-400 text-sm font-normal">
                Arrastra para cambiar
              </span>
            </h2>
            <ImagesEdition
              parentColumnKey="typology_id"
              parentColumnValue={typologyId}
              table="typology_image"
              buildHref={buildHref}
              images={images}
            />
          </div>
        ) : null}
      </div>
    </>
  );
}
