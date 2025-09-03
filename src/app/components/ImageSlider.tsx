"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { parseAsInteger, useQueryState } from "nuqs";
import { useRouter } from "next/navigation";

interface ImageProp {
  src: string;
  propertySlug: string;
  propertyTitle: string;
}

const ImageSlider = ({ images }: { images: ImageProp[] }) => {
  const router = useRouter();
  const multipleImages = images.length > 1;
  const [touchStart, setTouchStart] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentImageIndex, setCurrentImageIndex] = useQueryState(
    "imagen",
    parseAsInteger.withDefault(0)
  );

  const goToNextImage = useCallback(() => {
    const nextIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(nextIndex);
  }, [currentImageIndex, images.length, setCurrentImageIndex]);

  const goToPreviousImage = useCallback(() => {
    const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(prevIndex);
  }, [currentImageIndex, images.length, setCurrentImageIndex]);

  const currentImage = useMemo(() => {
    const index = Number.isNaN(currentImageIndex) ? 0 : currentImageIndex;
    return images[index] || images[0];
  }, [images, currentImageIndex]);

  return (
    <div className="relative md:px-12 w-full mx-auto">
      {multipleImages && (
        <button
          onClick={goToPreviousImage}
          className="hidden md:flex outline-none absolute w-12 items-center justify-center h-full left-0 top-0 bottom-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M20 12H4m0 0l6-6m-6 6l6 6"
            />
          </svg>
        </button>
      )}
      {currentImage && (
        <div
          ref={containerRef}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") goToPreviousImage();
            if (e.key === "ArrowRight") goToNextImage();
            if (e.key === "Escape") router.back();
          }}
          onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const swipeDistance = e.changedTouches[0].clientX - touchStart;
            if (swipeDistance > 50) goToPreviousImage();
            if (swipeDistance < -50) goToNextImage();
          }}
          className="w-full relative focus:outline-none"
        >
          <Link
            href={`/inmueble/${currentImage.propertySlug}/imagenes?imagen=${currentImageIndex}`}
            className="mx-auto cursor-pointer"
          >
            <Image
              src={currentImage.src}
              alt={currentImage.propertyTitle}
              className="w-full aspect-5/4 object-cover rounded-3xl"
              width={400}
              height={300}
            />
          </Link>

          {multipleImages && (
            <div className="w-full items-center flex gap-3 flex-wrap justify-center absolute bottom-3 left-0 right-0">
              {images.map((image) => (
                <button
                  key={image.src}
                  onClick={() => {
                    const index = images.findIndex(
                      (img) => img.src === image.src
                    );
                    setCurrentImageIndex(index);
                  }}
                  className="relative w-3 h-3 cursor-pointer outline-0"
                >
                  <div
                    className={`${
                      currentImageIndex ===
                      images.findIndex((img) => img.src === image.src)
                        ? "bg-yellow-400 w-4 h-4"
                        : "bg-gray-300"
                    } absolute left-0.5 -translate-x-1/2 top-0.5 -translate-y-1/2 w-3 h-3 rounded-full transition-all duration-300`}
                  ></div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {multipleImages && (
        <button
          onClick={goToNextImage}
          className="hidden md:flex outline-none absolute w-12 items-center justify-center h-full right-0 top-0 bottom-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M4 12h16m0 0l-6-6m6 6l-6 6"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ImageSlider;
