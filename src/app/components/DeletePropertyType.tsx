import { supabase } from "@/lib/supabase";
import useSWR, { mutate } from "swr";
import DeleteButton from "./DeleteButton";
import { useState } from "react";

type Typology = {
  id: string;
};

async function fetcher(propertyId: string): Promise<Typology[]> {
  const { data, error } = await supabase
    .from("typology")
    .select()
    .eq("property_id", propertyId);
  if (error) throw error;
  return data;
}

export default function DeletePropertyType({
  propertyId,
  id,
}: {
  propertyId: string;
  id: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: typologies } = useSWR(`${propertyId}-typologies`, () =>
    fetcher(propertyId)
  );
  const onDelete = async (id: string) => {
    const confirmationMessage = confirm(
      "Esta acción es irreversible. Esta seguro?"
    );
    if (!confirmationMessage) return;

    setIsDeleting(true);

    try {
      const { data: deletedTypology } = await supabase
        .from("typology")
        .delete()
        .eq("id", id)
        .select("id")
        .single();

      if (deletedTypology && typologies) {
        await mutate(`${propertyId}-typologies`);
      }
    } catch (error) {
      console.error(`Error eliminando este item: ${error}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return <DeleteButton isDeleting={isDeleting} onClick={() => onDelete(id)} />;
}
