'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type ImageData = {
  id: string;
  url: string;
  altText: string;
};

export default function ImageCarousel({ images }: { images: ImageData[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  // CASE 1: Single Image
  // We remove the fixed height constraint slightly so the image displays 
  // in its natural aspect ratio without cropping, while keeping max-height sanity.
  if (images.length === 1) {
    return (
      <div className="relative w-full mb-8 rounded-sm overflow-hidden border border-gray-200 bg-gray-50">
        {/* 
           Using "responsive" aspect ratio behavior for single images 
           so we don't force a huge empty box.
        */}
        <div className="relative w-full h-[400px]"> 
          <Image 
            src={images[0].url} 
            alt={images[0].altText} 
            fill
            className="object-contain" 
            priority
          />
        </div>
      </div>
    );
  }

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // CASE 2: Multiple Images (Carousel)
  // We MUST keep a fixed height here (h-96) so the buttons don't jump around
  // when switching between images of different sizes.
  return (
    <div className="relative w-full h-64 md:h-[500px] mb-8 group rounded-sm overflow-hidden border border-gray-200 bg-gray-50">
      
      {/* Main Image */}
      <Image
        src={images[currentIndex].url}
        alt={images[currentIndex].altText}
        fill
        // CHANGE HERE: 'object-contain' ensures the whole image is visible
        className="object-contain transition-all duration-500"
        priority
      />

      {/* Left Arrow */}
      <button 
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 hover:bg-brand-primary text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Right Arrow */}
      <button 
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 hover:bg-brand-primary text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
      >
        <ChevronRight size={28} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 p-2 rounded-full bg-black/10 backdrop-blur-sm">
        {images.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => setCurrentIndex(slideIndex)}
            className={`cursor-pointer w-3 h-3 rounded-full transition-colors shadow-sm ${
              currentIndex === slideIndex ? 'bg-brand-primary' : 'bg-white hover:bg-gray-200'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}