"use client";

import { useEffect, useCallback, useMemo, useState, useRef } from "react";
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
  const imageContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleEscapeKey = (event: Event) => {
      if (event instanceof KeyboardEvent && event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        router.back();
      }
    };

    window.addEventListener("keydown", handleEscapeKey, true);

    return () => {
      window.removeEventListener("keydown", handleEscapeKey, true);
    };
  }, [router]);

  useEffect(() => {
    if (!multipleImages) {
      return;
    }
    const container = imageContainerRef.current;
    if (!container) {
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
    container.addEventListener("touchstart", handleNavigationEvents, true);
    container.addEventListener("touchend", handleNavigationEvents, true);

    return () => {
      window.removeEventListener("keydown", handleNavigationEvents, true);
      container.removeEventListener("touchstart", handleNavigationEvents, true);
      container.removeEventListener("touchend", handleNavigationEvents, true);
    };
  }, [goToNextImage, goToPreviousImage, touchStart, multipleImages]);

  const currentImage = useMemo(() => {
    const index = Number.isNaN(currentImageIndex) ? 0 : currentImageIndex;
    return images[index] || images[0];
  }, [images, currentImageIndex]);
  
  return (
    <div className="relative pl-12 md:pr-12 w-full mx-auto">
      {multipleImages ? (
        <button
          onClick={goToPreviousImage}
          className="hidden md:flex outline-none absolute w-12 items-center justify-center h-full left-0 top-0 bottom-0"
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
        <div className="w-full relative" ref={imageContainerRef}>
          
          <Link
            href={`/inmueble/${currentImage.propertySlug}/imagenes?imagen=${currentImageIndex}`}
            className="w-full aspect-5/4 mx-auto cursor-pointer"
          >
            <Image
              src={currentImage.src}
              alt={currentImage.propertyTitle}
              className="w-full aspect-5/4 mx-auto object-cover rounded-3xl"
              width={400}
              height={300}
            />
          </Link>
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
          className="hidden md:flex outline-none absolute w-12 items-center justify-center h-full right-0 top-0 bottom-0"
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
    </div>
  );
};

export default ImageSlider;
