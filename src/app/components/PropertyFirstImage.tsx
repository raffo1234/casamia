import { Icon } from "@iconify/react";
import Image from "next/image";

export default function PropertyFirstImage({
  src,
  title,
}: {
  src: string | undefined;
  title: string;
}) {
  if (!src)
    return (
      <div className="animate-pulse bg-gray-100 rounded-xl w-full aspect-[5/4] flex justify-center items-center">
        <Icon icon="solar:gallery-broken" fontSize={32} />
      </div>
    );

  return (
    <Image
      src={src}
      alt={title}
      title={title}
      width={350}
      height={350}
      className="w-full aspect-[5/4] object-cover rounded-xl bg-gray-100"
    />
  );
}
