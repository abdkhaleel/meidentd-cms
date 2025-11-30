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
  const hasInfo = Boolean(currentImage.caption || currentImage.altText);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full mb-8 group rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      
      <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] bg-gray-50">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            <Image
              src={currentImage.url}
              alt={currentImage.altText}
              fill
              className="object-contain p-2"
              priority={currentIndex === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </motion.div>
        </AnimatePresence>

        {isMulti && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 backdrop-blur-sm"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 backdrop-blur-sm"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5 p-1.5 rounded-full bg-black/10 backdrop-blur-sm">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    currentIndex === idx ? 'bg-white w-4' : 'bg-white/50 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {hasInfo && (
          <button
            onClick={() => setShowCaption(!showCaption)}
            className={`absolute top-3 right-3 p-2 rounded-full shadow-sm transition-all backdrop-blur-md z-20 ${
               showCaption 
                 ? 'bg-blue-50 text-brand-primary' 
                 : 'bg-white/80 text-gray-500 hover:bg-white'
            }`}
            title={showCaption ? "Collapse Info" : "Expand Info"}
          >
            {showCaption ? <X className="w-4 h-4" /> : <Info className="w-4 h-4" />}
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {hasInfo && showCaption && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-gray-100 bg-white"
          >
            <div className="p-4 md:p-5">
              <div className="flex items-center justify-center text-center gap-3">
                 <div className="min-w-[4px] h-full self-stretch bg-brand-primary/20 rounded-full mt-1"></div>
                 <div>
                    <p className="text-gray-700 text-sm md:text-base font-medium leading-relaxed">
                      {currentImage.caption || currentImage.altText}
                    </p>
                    {currentImage.caption && currentImage.altText && currentImage.altText !== currentImage.caption && (
                      <p className="text-xs text-gray-400 mt-1.5 uppercase tracking-wide font-semibold">
                        {currentImage.altText}
                      </p>
                    )}
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}