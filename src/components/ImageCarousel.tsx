'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
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

  // LOGIC UPDATE:
  // 1. Trim strings to ensure empty whitespace doesn't trigger the UI
  // 2. Remove the || `Figure...` fallback
  const displayCaption = currentImage.caption?.trim();
  const displayLabel = currentImage.altText?.trim();
  
  // Only show info if actual content exists
  const hasInfo = Boolean(displayCaption || displayLabel);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <figure className="w-full mb-10 group relative">
      
      {/* IMAGE CONTAINER */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] bg-slate-50/50 rounded-sm overflow-hidden ring-1 ring-slate-900/5">
        
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-full h-full"
          >
            <Image
              src={currentImage.url}
              // Fallback to empty string for accessibility if no alt text is provided
              alt={displayLabel || ""} 
              fill
              className="object-contain p-4 md:p-8"
              priority={currentIndex === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </motion.div>
        </AnimatePresence>

        {isMulti && (
          <>
            <div className="absolute inset-y-0 left-0 flex items-center pl-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <button 
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                className="bg-white/80 hover:bg-blue-600 hover:text-white text-slate-700 p-2 rounded-sm backdrop-blur-sm transition-colors"
                aria-label="Previous"
                >
                <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
                </button>
            </div>
            
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <button 
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                className="bg-white/80 hover:bg-blue-600 hover:text-white text-slate-700 p-2 rounded-sm backdrop-blur-sm transition-colors"
                aria-label="Next"
                >
                <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
                </button>
            </div>

            <div className="absolute bottom-0 left-0 w-full flex justify-center pb-4 z-10">
               <div className="flex space-x-1 p-1 bg-slate-100/50 backdrop-blur-md rounded-sm">
                {images.map((_, idx) => (
                    <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                        currentIndex === idx ? 'w-6 bg-blue-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                    />
                ))}
               </div>
            </div>
          </>
        )}
        
        {/* Toggle Button: Only render if content exists */}
        {hasInfo && (
          <button
            onClick={() => setShowCaption(!showCaption)}
            className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100 z-20"
            title="Toggle details"
          >
            <Info className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* CAPTION SECTION: Only render if content exists */}
      <AnimatePresence initial={false}>
        {hasInfo && showCaption && (
          <motion.figcaption
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="pt-4 flex flex-col items-center justify-center text-center gap-1.5">
               
               {displayCaption && (
                 <span className="font-sans text-sm font-bold text-slate-900 leading-relaxed max-w-2xl">
                    {displayCaption}
                 </span>
               )}

               {displayLabel && (
                 <span className="font-mono text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">
                   {displayLabel}
                 </span>
               )}

            </div>
          </motion.figcaption>
        )}
      </AnimatePresence>

    </figure>
  );
}