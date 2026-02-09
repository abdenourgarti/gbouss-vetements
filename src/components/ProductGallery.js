"use client";

import { useState } from "react";
import Image from "next/image";

const ProductGallery = ({ selectedColor }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mapping des couleurs aux images
  const colorImages = {
    noir: ["/images/hoodie-noir.jpg"],
    bleu: ["/images/hoodie-bleu.jpg"],
    vert: ["/images/hoodie-vert1.jpg"],
    gris: ["/images/hoodie-gris.jpg"],
    beige: ["/images/hoodie-beige.jpg"],
  };

  const images = selectedColor
    ? colorImages[selectedColor]
    : ["/images/hoodie-noir.jpg"];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="w-full">
      <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
        <Image
          src={images[currentImageIndex]}
          alt={`Hoodie ${selectedColor || "noir"}`}
          fill
          className="object-cover"
          priority
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all"
              aria-label="Image précédente"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all"
              aria-label="Image suivante"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex ? "bg-white w-6" : "bg-white/50"
                }`}
                aria-label={`Image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGallery;
