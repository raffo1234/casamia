import { supabase } from "@/lib/supabase";
import { getAdminPropertiesUserKey } from "@/constants";
import { mutate } from "swr";
import DeleteButton from "./DeleteButton";
import { useState } from "react";

export default function DeleteProperty({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = async (id: string) => {
    const confirmationMessage = confirm(
      "Esta acción es irreversible. Esta seguro?"
    );
    if (!confirmationMessage) return;

    setIsDeleting(true);

    try {
      const { data: deletedProperty } = await supabase
        .from("property")
        .delete()
        .eq("id", id)
        .select("id")
        .single();

      if (deletedProperty) {
        await mutate(getAdminPropertiesUserKey(userId));
      }
    } catch (error) {
      console.error(`Error eliminando este item: ${error}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return <DeleteButton isDeleting={isDeleting} onClick={() => onDelete(id)} />;
}
