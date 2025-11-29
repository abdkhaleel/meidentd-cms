'use client';

import { useState } from 'react';
import Image from 'next/image';

export type ImageData = {
  id: string;
  url: string;
  caption: string | null;
  altText: string;
};

export type SectionData = {
  order: any;
  id: string;
  title: string;
  content: string;
  images: ImageData[];
  children: SectionData[];
};

export default function AccordionSection({ section }: { section: SectionData }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-border last:border-b-0">
      {/* Section Header - Click to toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-5 px-6 flex justify-between items-center bg-white hover:bg-gray-hover transition-all duration-200 group"
      >
        {/* Title - Uses Brand Primary Color */}
        <h3 className="text-lg md:text-xl font-bold text-brand-primary group-hover:text-brand-deep transition-colors">
          {section.title}
        </h3>
        
        {/* Modern SVG Arrow Icon */}
        <span 
          className={`
            text-brand-bright transform transition-transform duration-300 
            ${isOpen ? 'rotate-180' : 'rotate-0'}
          `}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </span>
      </button>

      {/* Section Content - Shows when open */}
      {isOpen && (
        <div className="px-6 pb-8 pt-2 bg-white animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Display Images */}
          {section.images && section.images.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-6">
              {section.images.map(img => (
                <div key={img.id} className="relative w-48 h-32 md:w-64 md:h-40 border border-gray-200 shadow-sm overflow-hidden rounded-sm">
                  <Image 
                    src={img.url} 
                    alt={img.altText} 
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          )}

          {/* 
             Display Rich Text Content 
             CRITICAL: distinct 'prose-brand' class we created in globals.css 
             handles the coloring of h1-h6 and links automatically.
          */}
          <div
            className="prose-brand mb-6"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />

          {/* Recursive Rendering for Child Sections */}
          {section.children && section.children.length > 0 && (
            <div className="mt-6 pl-4 md:pl-8 border-l-4 border-brand-bright/20">
              {section.children.map(child => (
                <AccordionSection key={child.id} section={child} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}