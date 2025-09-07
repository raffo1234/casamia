"use client";

import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import { parseAsInteger, useQueryState } from "nuqs";

interface ImageProp {
  src: string;
  propertySlug: string;
  propertyTitle: string;
}

const ImageSliderFullScreen = ({
  images,
  onClose,
}: {
  images: ImageProp[];
  onClose: () => void;
}) => {
  const multipleImages = images.length > 1;
  const [touchStart, setTouchStart] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentImageIndex, setCurrentImageIndex] = useQueryState(
    "imagen",
    parseAsInteger.withDefault(0)
  );

  const goToNextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length, setCurrentImageIndex]);

  const goToPreviousImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length, setCurrentImageIndex]);

  const currentImage = useMemo(
    () => images[currentImageIndex],
    [images, currentImageIndex]
  );

  useEffect(() => {
    if (multipleImages) {
      const nextIndex = (currentImageIndex + 1) % images.length;
      const prevIndex = (currentImageIndex - 1 + images.length) % images.length;

      new window.Image().src = images[nextIndex].src;
      new window.Image().src = images[prevIndex].src;
    }
  }, [currentImageIndex, images, multipleImages]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") goToPreviousImage();
        if (e.key === "ArrowRight") goToNextImage();
        if (e.key === "Escape") onClose();
      }}
      onTouchStart={(e) => {
        if (e.touches.length === 1) {
          setTouchStart(e.touches[0].clientX);
        }
      }}
      onTouchEnd={(e) => {
        if (e.changedTouches.length === 1 && touchStart !== 0) {
          const swipeDistance = e.changedTouches[0].clientX - touchStart;
          if (swipeDistance > 50) goToPreviousImage();
          if (swipeDistance < -50) goToNextImage();
        }
        setTouchStart(0);
      }}
      onWheel={(e) => {
        e.preventDefault();
        if (e.deltaY > 0) goToNextImage();
        if (e.deltaY < 0) goToPreviousImage();
      }}
      className="fixed top-0 left-0 bg-black px-2 md:px-12 h-full w-full z-[51] outline-none"
    >
      {multipleImages && (
        <>
          <button
            onClick={goToPreviousImage}
            className="hidden md:flex outline-none absolute w-12 text-white items-center justify-center h-full left-0 top-0 bottom-0"
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
          <button
            onClick={goToNextImage}
            className="hidden md:flex outline-none absolute w-12 text-white items-center justify-center h-full right-0 top-0 bottom-0"
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
        </>
      )}
      {currentImage && (
        <div className="relative h-full w-full">
          <Image
            key={currentImage.src}
            src={currentImage.src}
            alt={currentImage.propertyTitle}
            className="h-full animate-fade-in w-full object-contain"
            width={400}
            height={300}
            priority={currentImageIndex === 0}
          />
          {multipleImages && (
            <div className="w-full flex gap-3 justify-center absolute bottom-3 left-0 right-0">
              {images.map((image, index) => (
                <button
                  key={image.src}
                  onClick={() => setCurrentImageIndex(index)}
                  className="relative w-3 h-3 cursor-pointer outline-0"
                >
                  <div
                    className={`${
                      currentImageIndex === index
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
      <div className="absolute z-20 flex items-center top-3 right-3 rounded-[50px]">
        <div className="flex items-center text-lg h-13 px-4 mr-2 bg-white text-slate-600 bg-opacity-20 rounded-full">
          {currentImageIndex + 1}&nbsp;/&nbsp;{images.length}
        </div>
        <button
          onClick={onClose}
          className="cursor-pointer flex items-center justify-center rounded-full w-13 h-13 text-black bg-yellow-400"
        >
          <Icon
            icon="material-symbols-light:close-rounded"
            width={32}
            height={32}
          />
        </button>
      </div>
    </div>
  );
};

export default ImageSliderFullScreen;
