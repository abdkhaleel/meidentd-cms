'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion, useScroll, useSpring } from 'framer-motion';
// import { cn } from '@/lib/utils'
import ImageCarousel from '@/components/ImageCarousel';
import type { SectionData } from '@/components/AccordionSection';

// --- UTILITY HELPER (Put this in src/lib/utils.ts or keep here if you prefer) ---
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type PageData = {
  title: string;
  sections: SectionData[];
};

export default function DynamicPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [page, setPage] = useState<PageData | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Refs for scroll spy
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    if (!slug) return;
    async function getPageData() {
      try {
        const res = await fetch(`/api/pages/${slug}`);
        if (!res.ok) { setPage(null); return; }
        const data = await res.json();
        setPage(data);
        if (data.sections?.length > 0) setActiveSectionId(data.sections[0].id);
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        setLoading(false);
      }
    }
    getPageData();
  }, [slug]);

  // --- SCROLL SPY LOGIC ---
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset for header
      
      let currentId = activeSectionId;
      
      // Find the section currently in view
      if(page?.sections) {
        for (const section of page.sections) {
          const element = sectionRefs.current[section.id];
          if (element) {
            const { offsetTop, offsetHeight } = element;
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              currentId = section.id;
              break;
            }
          }
        }
      }
      
      if (currentId !== activeSectionId) {
        setActiveSectionId(currentId);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, activeSectionId]);


  // --- CLICK TO SCROLL ---
  const scrollToSection = (id: string) => {
    const element = sectionRefs.current[id];
    if (element) {
      const yOffset = -100; // Offset for fixed header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!page) return <div className="text-center py-20">Page not found.</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      
      {/* Page Title - Fade In */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 border-b border-gray-200 pb-6"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-brand-primary tracking-tight">
          {page.title}
        </h1>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-12 relative">
        
        {/* --- LEFT: STICKY MODERN SIDEBAR --- */}
        <aside className="hidden lg:block w-1/4 shrink-0">
          <div className="sticky top-32">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-4">
              On this page
            </h3>
            <nav className="relative">
              {/* Vertical gray line */}
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gray-100 rounded-full" />
              
              <ul className="space-y-1">
                {page.sections.map((section) => (
                  <li key={section.id} className="relative">
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={cn(
                        "relative w-full text-left py-2 pl-6 pr-4 text-sm font-medium transition-colors duration-200 rounded-r-md",
                        activeSectionId === section.id 
                          ? "text-brand-primary font-bold bg-blue-50/50" 
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      )}
                    >
                      {/* Active Indicator (The Moving Blue Line) */}
                      {activeSectionId === section.id && (
                        <motion.div
                          layoutId="activeSectionIndicator"
                          className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-primary rounded-full z-10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        {/* --- RIGHT: SMOOTH SCROLLING CONTENT --- */}
        <main className="w-full lg:w-3/4 space-y-24">
          {page.sections.map((section, index) => (
            <motion.section
              key={section.id}
              id={section.id}
              ref={(el) => { sectionRefs.current[section.id] = el; }} // Assign Ref
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="scroll-mt-32" // CSS scroll margin
            >
              
              {/* Section Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="h-[2px] w-8 bg-brand-bright rounded-full"></span>
                  <span className="text-sm font-bold text-brand-bright uppercase tracking-wider">
                    {section.order < 10 ? `0${section.order}` : section.order}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-brand-secondary">
                  {section.title}
                </h2>
              </div>

              {/* Image Slideshow (Full Width) */}
              {section.images && section.images.length > 0 && (
                <div className="mb-8 shadow-lg rounded-sm overflow-hidden border border-gray-100">
                   <ImageCarousel images={section.images} />
                </div>
              )}

              {/* Content Body */}
              <div 
                className="prose-brand prose-lg text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />

              {/* Child Sections (Nested Accordions or Cards) */}
              {section.children && section.children.length > 0 && (
                <div className="mt-10 grid gap-6 md:grid-cols-2">
                  {section.children.map(child => (
                    <div key={child.id} className="bg-gray-50 p-6 rounded-sm border-l-4 border-brand-secondary hover:shadow-md transition-shadow">
                      <h4 className="text-lg font-bold text-brand-primary mb-3">{child.title}</h4>
                      <div 
                        className="prose-sm text-gray-600 line-clamp-4"
                        dangerouslySetInnerHTML={{ __html: child.content }}
                      />
                    </div>
                  ))}
                </div>
              )}

            </motion.section>
          ))}

          {/* Empty Space at bottom to allow last section to scroll to top */}
          <div className="h-[20vh]"></div>
        </main>
      </div>
    </div>
  );
}