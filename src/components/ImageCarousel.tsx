'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type ImageData = {
  id: string;
  url: string;
  altText: string;
  caption?: string | null;
};

export default function ImageCarousel({ images }: { images: ImageData[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCaption, setShowCaption] = useState(true);

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const isMulti = images.length > 1;

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full mb-8 group rounded-sm overflow-hidden border border-gray-200 bg-gray-50">
      
      
      <div className="relative w-full h-64 md:h-[500px]">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative w-full h-full"
          >
            <Image
              src={currentImage.url}
              alt={currentImage.altText}
              fill
              className="object-contain" 
              priority={currentIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {isMulti && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 hover:bg-brand-primary text-white p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm z-20"
              aria-label="Previous Image"
            >
              <ChevronLeft size={24} />
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 hover:bg-brand-primary text-white p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm z-20"
              aria-label="Next Image"
            >
              <ChevronRight size={24} />
            </button>

            <div 
              className={`absolute left-1/2 transform -translate-x-1/2 flex space-x-2 p-2 rounded-full bg-black/10 backdrop-blur-sm z-20 transition-all duration-500 ${
              
                 showCaption && currentImage.caption ? 'bottom-[calc(100%-4rem)] md:bottom-24' : 'bottom-4'
              }`}
            >
              {images.map((_, slideIndex) => (
                <button
                  key={slideIndex}
                  onClick={() => setCurrentIndex(slideIndex)}
                  className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all shadow-sm ${
                    currentIndex === slideIndex ? 'bg-brand-primary w-6' : 'bg-white hover:bg-gray-200'
                  }`}
                  aria-label={`Go to slide ${slideIndex + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {currentImage.caption && (
          <>
            <button
              onClick={() => setShowCaption(!showCaption)}
              className="absolute top-3 right-3 z-30 p-1.5 rounded-full bg-black/20 hover:bg-black/60 text-gray-600 hover:text-white transition-colors backdrop-blur-md"
              title={showCaption ? "Hide Caption" : "Show Caption"}
            >
              {showCaption ? <X size={16} /> : <Info size={16} />}
            </button>

            <AnimatePresence>
              {showCaption && (
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute bottom-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 md:p-5 shadow-lg"
                >
                  <div className="max-w-3xl mx-auto">
                    <p className="text-gray-800 text-sm md:text-base font-medium leading-relaxed">
                      {currentImage.caption}
                    </p>
                    {currentImage.altText && currentImage.altText !== currentImage.caption && (
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                        {currentImage.altText}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}