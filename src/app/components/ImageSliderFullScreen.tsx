"use client";

import React, { useEffect, useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import { parseAsInteger, useQueryState } from "nuqs";
import { useRouter } from "next/navigation";

interface ImageProp {
  src: string;
  propertyId: string;
  propertyTitle: string;
}

const ImageSliderFullScreen = ({ images }: { images: ImageProp[] }) => {
  const multipleImages = images.length > 1;
  const router = useRouter();
  const [touchStart, setTouchStart] = useState(0);

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

  const currentImage = useMemo(() => {
    return images[currentImageIndex];
  }, [images, currentImageIndex]);

  useEffect(() => {
    if (!multipleImages) {
      return;
    }

    const handleNavigationEvents = (event: Event) => {
      if (event instanceof KeyboardEvent) {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          event.stopImmediatePropagation();
          goToPreviousImage();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          event.stopImmediatePropagation();
          goToNextImage();
        }
      } else if (
        typeof window !== "undefined" &&
        "TouchEvent" in window &&
        event instanceof TouchEvent
      ) {
        if (event.type === "touchstart") {
          setTouchStart(event.touches[0].clientX);
        } else if (event.type === "touchend") {
          const touchEnd = event.changedTouches[0].clientX;
          const swipeDistance = touchEnd - touchStart;
          const swipeThreshold = 50;

          if (swipeDistance > swipeThreshold) {
            goToPreviousImage();
          } else if (swipeDistance < -swipeThreshold) {
            goToNextImage();
          }
        }
      }
    };

    window.addEventListener("keydown", handleNavigationEvents, true);
    window.addEventListener("touchstart", handleNavigationEvents, true);
    window.addEventListener("touchend", handleNavigationEvents, true);

    return () => {
      window.removeEventListener("keydown", handleNavigationEvents, true);
      window.removeEventListener("touchstart", handleNavigationEvents, true);
      window.removeEventListener("touchend", handleNavigationEvents, true);
    };
  }, [goToNextImage, goToPreviousImage, touchStart, multipleImages]);

  useEffect(() => {
    const handleEscapeKey = (event: Event) => {
      if (event instanceof KeyboardEvent) {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopImmediatePropagation();
          router.back();
        }
      }
    };

    window.addEventListener("keydown", handleEscapeKey, true);

    return () => {
      window.removeEventListener("keydown", handleEscapeKey, true);
    };
  }, [router]);

  return (
    <div className="fixed top-0 left-0 bg-black z-50 px-2 md:px-12 h-full w-full">
      {multipleImages ? (
        <button
          onClick={goToPreviousImage}
          aria-label="Image anterior"
          className="hidden md:flex outline-none absolute w-12 text-white items-center-safe justify-center h-full left-0 top-0 bottom-0"
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
      ) : null}
      {currentImage && (
        <div className="relative h-full w-full">
          <Image
            src={currentImage.src}
            alt={currentImage.propertyTitle}
            className="h-full w-full object-contain"
            width={400}
            height={300}
          />
          {multipleImages ? (
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
                  className={`relative w-3 h-3 cursor-pointer outline-0`}
                >
                  <div
                    className={`${
                      currentImageIndex ===
                      images.findIndex((img) => img.src === image.src)
                        ? "bg-yellow-400 w-4 h-4"
                        : "bg-gray-300"
                    } absolute left-0.5 -translate-x-1/2 top-0.5 -translate-y-1/2 w-3 h-3 rounded-full cursor-pointer outline-0 transition-all duration-300`}
                  ></div>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      )}
      {multipleImages ? (
        <button
          onClick={goToNextImage}
          aria-label="Image siguiente"
          className="hidden md:flex outline-none absolute w-12 text-white items-center-safe justify-center h-full right-0 top-0 bottom-0"
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
      ) : null}
      <div className="absolute z-20 flex items-center top-3 right-3 rounded-[50px]">
        <div className="flex items-center text-lg h-13 px-4 mr-2 bg-white text-slate-600 bg-opacity-20 rounded-full">
          {currentImageIndex + 1}&nbsp;/&nbsp;{images.length}
        </div>
        <button
          onClick={router.back}
          title="Ir a la propiedad"
          aria-label="Volver a la propiedad"
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
