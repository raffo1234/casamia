"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

interface ImageProp {
  src: string;
  propertyId: string;
}

const ImageSlider = ({ images }: { images: ImageProp[] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToNextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  const goToPreviousImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

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
    <div className="relative px-12 w-full mx-auto">
      <button
        onClick={goToPreviousImage}
        className="outline-none absolute w-12 flex items-center-safe justify-center h-full left-0 top-0 bottom-0"
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
        <Link
          href={`/inmueble/${currentImage.propertyId}/imagenes`}
          className="w-full aspect-5/4 mx-auto cursor-pointer"
        >
          <Image
            src={currentImage.src}
            alt="Property Image"
            className="w-full aspect-5/4 mx-auto object-cover rounded-3xl"
            width={400}
            height={300}
          />
        </Link>
      )}

      <button
        onClick={goToNextImage}
        className="outline-none absolute w-12 flex items-center-safe justify-center h-full right-0 top-0 bottom-0"
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
    </div>
  );
};

export default ImageSlider;
