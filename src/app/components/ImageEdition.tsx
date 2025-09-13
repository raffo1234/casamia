"use client";

import Image from "next/image";
import DeleteButton from "./DeleteButton";
import deleteImage from "@/lib/deleteImage";
import { HTMLAttributes, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

export default function ImageEdition({
  image,
  parentColumnValue,
  table,
  isCover,
  dragHandleProps,
  href,
}: {
  image: { image_url: string; id: string };
  parentColumnValue: string;
  table: string;
  isCover?: boolean;
  dragHandleProps?: HTMLAttributes<HTMLButtonElement>;
  href: string;
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

    await mutate([parentColumnValue, "images"]);
    setIsDeleting(false);
    toast.success("Imagen eliminada exitosamente.");
  };

  return (
    <>
      <article key={id} className="relative animate-fade-in">
        <Link href={href} className="relative w-full aspect-[5/4]">
          <Image
            key={image_url}
            src={image_url}
            alt={id}
            className="w-full aspect-[5/4] object-cover rounded-3xl bg-gray-100"
            width={500}
            height={400}
          />
          {isCover ? (
            <span
              className="absolute left-0 top-0 bg-cyan-100 backdrop-blur-sm
      py-1 px-10 rounded-br-3xl rounded-tl-3xl text-xs font-semibold uppercase
      shadow-sm"
            >
              Portada
            </span>
          ) : null}
        </Link>
        <button
          {...dragHandleProps}
          className="cursor-grab absolute p-2 w-11 h-11 flex transition-colors duration-300 items-center justify-center top-1 right-1 rounded-full bg-white hover:bg-slate-100"
        >
          <Icon icon="fluent:drag-24-regular" fontSize={28}></Icon>
        </button>
        <footer className="flex bg-white justify-center border-x border-b border-gray-100 -mt-3 pt-6 pb-3 px-4 rounded-b-3xl">
          <DeleteButton isDeleting={isDeleting} onClick={() => onDelete(id)} />
        </footer>
      </article>
    </>
  );
}
