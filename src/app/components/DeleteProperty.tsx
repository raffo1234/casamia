import { getAdminPropertiesUserKey } from "@/constants";
import { mutate } from "swr";
import DeleteButton from "./DeleteButton";
import { useState } from "react";
import deleteEntitiesWithImages from "@/lib/deleteEntitiesWithImages";
import { getTypologyIdsByProperty } from "@/lib/getTypologyIdsByProperty";

export default function DeleteProperty({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = async (propertyId: string) => {
    const confirmationMessage = confirm(
      "Esta acción es irreversible. Esta seguro?"
    );
    if (!confirmationMessage) return;

    setIsDeleting(true);

    const typologyIds = await getTypologyIdsByProperty(propertyId);

    if (typologyIds.length > 0) {
      await deleteEntitiesWithImages(
        typologyIds,
        "typology",
        "typology_image",
        "typology_id",
        "image_url"
      );
    }

    await deleteEntitiesWithImages(
      [propertyId],
      "property",
      "property_image",
      "property_id",
      "image_url"
    );

    await mutate(getAdminPropertiesUserKey(userId));

    setIsDeleting(false);
  };

  return <DeleteButton isDeleting={isDeleting} onClick={() => onDelete(id)} />;
}
