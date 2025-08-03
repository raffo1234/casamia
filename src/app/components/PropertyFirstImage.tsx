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
      <div className="animate-pulse bg-gray-100 rounded-t-3xl w-full aspect-[5/4] flex justify-center items-center">
        <Icon icon="solar:gallery-broken" fontSize={32} />
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[5/4] rounded-t-3xl overflow-hidden">
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse"></div>
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
