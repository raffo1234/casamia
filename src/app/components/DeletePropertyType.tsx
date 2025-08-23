import DeleteButton from "./DeleteButton";
import { useState } from "react";
import deleteEntitiesWithImages from "@/lib/deleteEntitiesWithImages";
import { mutate } from "swr";

export default function DeletePropertyType({
  id,
  propertyId,
}: {
  id: string;
  propertyId: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = async (id: string) => {
    const confirmationMessage = confirm(
      "Esta acción es irreversible. Esta seguro?"
    );
    if (!confirmationMessage) return;

    setIsDeleting(true);

    await deleteEntitiesWithImages(
      [id],
      "typology",
      "typology_image",
      "typology_id",
      "image_url"
    );

    mutate(`${propertyId}-typology-with-images`);
    setIsDeleting(false);
  };

  return <DeleteButton isDeleting={isDeleting} onClick={() => onDelete(id)} />;
}
