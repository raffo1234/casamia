"use client";

import Image from "next/image";
import DeleteButton from "./DeleteButton";
import deleteImage from "@/lib/deleteImage";
import { useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";

export default function ImageEdition({
  image,
  parentColumnValue,
  table,
  openModal,
}: {
  image: { image_url: string; id: string };
  parentColumnValue: string;
  table: string;
  openModal: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { image_url, id } = image;

  const onDelete = async (id: string) => {
    const confirmationMessage = confirm(
      "Esta acción es irreversible. Esta seguro?"
    );
    if (!confirmationMessage) return;

    setIsDeleting(true);
    await deleteImage(id, table);

    await mutate(parentColumnValue);
    setIsDeleting(false);
    toast.success("Imagen eliminada exitosamente.");
  };

  return (
    <>
      <article key={id}>
        <button onClick={openModal}>
          <Image
            key={image_url}
            src={image_url}
            alt={id}
            className="w-full aspect-[5/4] object-cover rounded-xl bg-gray-100"
            width={400}
            height={300}
          />
        </button>
        <footer className="flex justify-center border-x border-b border-gray-100 -mt-3 pt-6 pb-3 px-4 rounded-b-xl">
          <DeleteButton isDeleting={isDeleting} onClick={() => onDelete(id)} />
        </footer>
      </article>
    </>
  );
}
