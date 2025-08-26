"use client";

import { useMemo, useState } from "react";
import ImageEdition from "./ImageEdition";
import ImageSliderFullScreen from "./ImageSliderFullScreen";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ImagesEdition({
  images,
  parentColumnValue,
  table,
  parentSlugValue,
}: {
  images: { image_url: string; id: string }[];
  parentColumnValue: string;
  table: string;
  parentSlugValue: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const openModal = (index: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("imagen", index.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    router.push(pathname, { scroll: false });
  };

  const imagesToSlider = useMemo(
    () =>
      images.map((image: { id: string; image_url: string }) => ({
        src: image.image_url,
        propertySlug: parentSlugValue,
        propertyTitle: parentSlugValue,
      })) || [],
    [images, parentSlugValue]
  );

  return (
    <>
      <section
        className="grid gap-6"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        }}
      >
        {images?.map((image, index) => (
          <ImageEdition
            key={image.id}
            image={image}
            parentColumnValue={parentColumnValue}
            table={table}
            openModal={() => openModal(index)}
          />
        ))}
      </section>
      {isOpen ? (
        <ImageSliderFullScreen images={imagesToSlider} onClose={closeModal} />
      ) : null}
    </>
  );
}
