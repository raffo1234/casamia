"use client";

import React, { useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import { parseAsInteger, useQueryState } from "nuqs";
import Link from "antd/es/typography/Link";

interface ImageProp {
  src: string;
  propertyId: string;
  propertyTitle: string;
}

const ImageSliderFullScreen = ({ images }: { images: ImageProp[] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useQueryState(
    "imagen",
    parseAsInteger.withDefault(0)
  );

  const goToNextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length, setCurrentImageIndex]);

  const goToPreviousImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length, setCurrentImageIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        goToPreviousImage();
      } else if (event.key === "ArrowRight") {
        goToNextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goToNextImage, goToPreviousImage]);

  const currentImage = useMemo(() => {
    return images[currentImageIndex];
  }, [images, currentImageIndex]);

  return (
    <div className="fixed top-0 left-0 bg-black z-50 px-12 h-full w-full">
      <button
        onClick={goToPreviousImage}
        className="outline-none absolute w-12 text-white flex items-center-safe justify-center h-full left-0 top-0 bottom-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
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
      {currentImage && (
        <Image
          src={currentImage.src}
          alt={currentImage.propertyTitle}
          className="h-full w-full object-contain"
          width={400}
          height={300}
        />
      )}
      <button
        onClick={goToNextImage}
        className="outline-none absolute w-12 flex items-center-safe justify-center h-full right-0 top-0 bottom-0 text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
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
      <div className="absolute z-20 flex items-center top-5 right-5 bg-slate-800 p-2 rounded-[50px]">
        <div className="flex items-center text-xl h-16 px-4 mr-2 bg-white text-slate-600 font-light bg-opacity-20 rounded-full">
          {currentImageIndex + 1}&nbsp;/&nbsp;{images.length}
        </div>
        <Link
          href={`/inmueble/${currentImage.propertyId}/?imagen=${currentImageIndex}`}
          title="Ir a la propiedad"
          className="flex items-center justify-center rounded-full w-16 h-16 text-black bg-yellow-400"
        >
          <Icon
            icon="material-symbols-light:close-rounded"
            width={40}
            height={40}
          />
        </Link>
      </div>
    </div>
  );
};

export default ImageSliderFullScreen;
