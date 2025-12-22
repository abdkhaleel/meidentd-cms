'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Info, Maximize2 } from 'lucide-react';
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
    <figure className="w-full mb-10 group relative">
      
      {/* IMAGE CONTAINER: Flush, Technical, No Shadow */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] bg-slate-50/50 rounded-sm overflow-hidden ring-1 ring-slate-900/5">
        
        {/* Subtle grid pattern for engineering feel */}
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
              alt={currentImage.altText}
              fill
              className="object-contain p-4 md:p-8"
              priority={currentIndex === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </motion.div>
        </AnimatePresence>

        {/* CONTROLS: Minimalist & Flush */}
        {isMulti && (
          <>
            {/* Arrows - Only visible on hover */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                className="bg-white/80 hover:bg-blue-600 hover:text-white text-slate-700 p-2 rounded-sm backdrop-blur-sm transition-colors"
                aria-label="Previous"
                >
                <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
                </button>
            </div>
            
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                className="bg-white/80 hover:bg-blue-600 hover:text-white text-slate-700 p-2 rounded-sm backdrop-blur-sm transition-colors"
                aria-label="Next"
                >
                <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
                </button>
            </div>

            {/* Pagination Dots - Technical Rectangle Style */}
            <div className="absolute bottom-0 left-0 w-full flex justify-center pb-4">
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
        
        {/* Toggle Caption Button (Top Right) */}
        {hasInfo && (
          <button
            onClick={() => setShowCaption(!showCaption)}
            className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
            title="Toggle details"
          >
            <Info className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* CAPTION: Separated, Technical Label Style */}
      <AnimatePresence initial={false}>
        {hasInfo && showCaption && (
          <motion.figcaption
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3 flex items-start gap-3 border-l-2 border-blue-500/30 pl-3 ml-1">
               <div className="flex flex-col gap-1">
                  {currentImage.caption && (
                    <span className="font-sans text-sm text-slate-600 leading-relaxed">
                       {currentImage.caption}
                    </span>
                  )}
                  <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {currentImage.altText || `Figure ${currentIndex + 1}.${0}`}
                  </span>
               </div>
            </div>
          </motion.figcaption>
        )}
      </AnimatePresence>

    </figure>
  );
}