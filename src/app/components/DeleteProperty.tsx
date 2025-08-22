import { getAdminPropertiesUserKey } from "@/constants";
import { mutate } from "swr";
import DeleteButton from "./DeleteButton";
import { useState } from "react";
import deleteEntityWithImages from "@/lib/deleteEntityWithImages";

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

    await deleteEntityWithImages(id, "property");

    await mutate(getAdminPropertiesUserKey(userId));
    setIsDeleting(false);
  };

  return <DeleteButton isDeleting={isDeleting} onClick={() => onDelete(id)} />;
}
