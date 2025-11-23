'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import ImageCarousel from '@/components/ImageCarousel';
import type { SectionData } from '@/components/AccordionSection';
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// --- UTILITY HELPER ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type PageData = {
  title: string;
  sections: SectionData[];
};

// ============================================================================
// 1. RECURSIVE SECTION COMPONENT
//    This handles the rendering of a section and all its nested children.
// ============================================================================
function RecursiveSection({ section, level }: { section: SectionData; level: number }) {
  
  // --- DYNAMIC STYLING BASED ON NESTING LEVEL ---
  const isTopLevel = level === 0;
  const isFirstChild = level === 1;
  const isDeepChild = level > 1;

  return (
    <div className={cn(
      "w-full",
      // Add margin top for nested items to separate them
      isFirstChild && "mt-10 bg-gray-50 p-6 rounded-sm border-l-4 border-brand-secondary shadow-sm",
      isDeepChild && "mt-6 pl-6 border-l-2 border-gray-200",
    )}>
      
      {/* A. SECTION HEADER */}
      <div className="mb-4">
        {isTopLevel ? (
          // LEVEL 0: Big Header with Numbering (Handled in parent loop visually, but title here)
          <h2 className="text-3xl font-bold text-brand-secondary mb-4">
             {section.title}
          </h2>
        ) : (
          // LEVEL 1+: Smaller Headers
          <h3 className={cn(
            "font-bold text-brand-primary",
            isFirstChild ? "text-xl mb-3" : "text-lg mb-2 text-gray-700"
          )}>
            {section.title}
          </h3>
        )}
      </div>

      {/* B. IMAGE CAROUSEL (Usually only for Level 0 or 1) */}
      {section.images && section.images.length > 0 && (
        <div className={cn(
          "mb-6 rounded-sm overflow-hidden border border-gray-100",
          isTopLevel ? "shadow-lg" : "shadow-sm"
        )}>
          <ImageCarousel images={section.images} />
        </div>
      )}

      {/* C. RICH TEXT CONTENT */}
      <div 
        className={cn(
          "prose-brand leading-relaxed text-gray-600",
          isTopLevel ? "prose-lg" : "prose-sm", // Smaller text for nested items
          
          // --- FORCE TABLE STYLING (Applied at all levels) ---
          "[&_table]:w-full [&_table]:border-collapse [&_table]:my-6 [&_table]:shadow-sm",
          "[&_table]:border-t-[3px] [&_table]:border-brand-primary [&_table]:bg-white",
          "[&_th]:bg-gray-100 [&_th]:text-brand-secondary [&_th]:font-bold [&_th]:uppercase",
          "[&_th]:text-xs [&_th]:tracking-wider [&_th]:p-3 [&_th]:text-left [&_th]:border-b [&_th]:border-gray-200",
          "[&_td]:p-3 [&_td]:text-sm [&_td]:border-b [&_td]:border-gray-100 [&_td]:align-top",
          "[&_tr]:transition-colors [&_tr:hover]:bg-blue-50/30"
        )}
        dangerouslySetInnerHTML={{ __html: section.content }}
      />

      {/* D. RECURSIVE CHILDREN RENDERING */}
      {section.children && section.children.length > 0 && (
        <div className={cn(
          "w-full",
          // If Level 0, grid the children side-by-side (if logical), else stack them
          isTopLevel ? "grid gap-6 md:grid-cols-1" : "flex flex-col"
        )}>
          {section.children.map((child) => (
            <RecursiveSection key={child.id} section={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}


// ============================================================================
// 2. MAIN PAGE COMPONENT
// ============================================================================
export default function DynamicPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [page, setPage] = useState<PageData | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>("");
  const [loading, setLoading] = useState(true);

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

  // --- SCROLL SPY ---
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; 
      let currentId = activeSectionId;
      
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
      if (currentId !== activeSectionId) setActiveSectionId(currentId);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, activeSectionId]);

  // --- CLICK TO SCROLL ---
  const scrollToSection = (id: string) => {
    const element = sectionRefs.current[id];
    if (element) {
      const yOffset = -100;
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
      
      {/* Page Title */}
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
        
        {/* --- SIDEBAR --- */}
        <aside className="hidden lg:block w-1/4 shrink-0">
          <div className="sticky top-32">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-4">
              On this page
            </h3>
            <nav className="relative">
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

        {/* --- MAIN CONTENT --- */}
        <main className="w-full lg:w-3/4 space-y-24">
          {page.sections.map((section, index) => (
            <motion.section
              key={section.id}
              id={section.id}
              // The REF is crucial for the Scroll Spy to work
              ref={(el) => { sectionRefs.current[section.id] = el; }} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="scroll-mt-32"
            >
              
              {/* 
                DECORATIVE HEADER FOR TOP LEVEL 
                (We only do this for the root level sections to keep them distinct)
              */}
              <div className="flex items-center gap-3 mb-6">
                <span className="h-[2px] w-8 bg-brand-bright rounded-full"></span>
                <span className="text-sm font-bold text-brand-bright uppercase tracking-wider">
                  {section.order < 10 ? `0${section.order}` : section.order}
                </span>
              </div>

              {/* 
                RENDER THE SECTION RECURSIVELY 
                Pass level={0} to start the style hierarchy
              */}
              <RecursiveSection section={section} level={0} />

            </motion.section>
          ))}

          <div className="h-[20vh]"></div>
        </main>
      </div>
    </div>
  );
}