import { getAdminPropertiesUserKey } from "@/constants";
import { mutate } from "swr";
import DeleteButton from "./DeleteButton";
import { useState } from "react";
import deleteEntitiesWithImages from "@/lib/deleteEntitiesWithImages";

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

    await deleteEntitiesWithImages(
      [id],
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
