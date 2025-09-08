import Image from "next/image";
import { Icon } from "@iconify/react";

export default function FirstImage({
  src,
  title,
}: {
  src: string | undefined;
  title: string;
}) {
  if (!src) {
    return (
      <div className="animate-pulse bg-gray-100 rounded-t-3xl w-full aspect-[5/4] flex justify-center items-center">
        <Icon icon="solar:gallery-broken" fontSize={32} />
      </div>
    );
  }

  return (
    <div className="relative animate-fade-in w-full aspect-[5/4]">
      <Image
        src={src}
        alt={title}
        title={title}
        fill
        className="object-cover transition-opacity duration-500 ease-in-out"
        priority={true}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}
