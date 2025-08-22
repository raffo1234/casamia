"use client";

import Image from "next/image";
import DeleteButton from "./DeleteButton";
import deleteImage from "@/lib/deleteImage";
import { useState } from "react";
import toast from "react-hot-toast";
import { getAdminPropertiesUserKey } from "@/constants";
import { mutate } from "swr";

export default function PropertyImagen({
  propertyImage,
  userId,
  mutateProperty,
}: {
  userId: string;
  propertyImage: { image_url: string; id: string };
  mutateProperty: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { image_url, id } = propertyImage;

  const onDelete = async (id: string) => {
    const confirmationMessage = confirm(
      "Esta acción es irreversible. Esta seguro?"
    );
    if (!confirmationMessage) return;

    setIsDeleting(true);
    await deleteImage(id, "property_image", "image_url");

    await mutate(() => getAdminPropertiesUserKey(userId));
    await mutateProperty();
    setIsDeleting(false);
    toast.success("Imagen eliminada exitosamente.");
  };

  return (
    <article key={id}>
      <Image
        key={image_url}
        src={image_url}
        alt={id}
        className="w-full aspect-[5/4] object-cover rounded-xl bg-gray-100"
        width={400}
        height={300}
      />
      <footer className="flex justify-center border-x border-b border-gray-100 -mt-3 pt-6 pb-3 px-4 rounded-b-xl">
        <DeleteButton isDeleting={isDeleting} onClick={() => onDelete(id)} />
      </footer>
    </article>
  );
}
