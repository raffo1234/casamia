import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";

export default function PropertyFirstImage({
  src,
  title,
}: {
  src: string | undefined;
  title: string;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!src) {
    return (
      <div className="animate-pulse bg-gray-100 rounded-xl w-full aspect-[5/4] flex justify-center items-center">
        <Icon icon="solar:gallery-broken" fontSize={32} />
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[5/4] rounded-xl overflow-hidden">
      {!imageLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-100 flex justify-center items-center">
          <Icon icon="solar:gallery-broken" fontSize={32} />
        </div>
      )}

      <Image
        src={src}
        alt={title}
        title={title}
        width={350}
        height={350}
        className={`
          w-full h-full object-cover
          transition-opacity duration-500 ease-in-out
          ${imageLoaded ? "opacity-100" : "opacity-0 invisible"}
        `}
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  );
}
