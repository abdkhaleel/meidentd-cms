'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, LayoutGrid, FileText, ExternalLink, Paperclip, Hash, ArrowRight } from 'lucide-react';
import ImageCarousel from '@/components/ImageCarousel';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- TYPES ---
export type ImageData = {
  id: string;
  url: string;
  caption?: string | null;
  altText: string;
};

export type DocumentData = {
  id: string;
  url: string;
  title: string | null;
  filename: string;
  fileSize?: number;
};

export type SectionData = {
  id: string;
  title: string;
  content: string;
  order: number;
  children: SectionData[];
  images: ImageData[];
  documents: DocumentData[];
};

type PageData = {
  title: string;
  sections: SectionData[];
};

// --- SUB-COMPONENTS ---

// 1. Documents Component
function SectionDocuments({ docs }: { docs: DocumentData[] }) {
  if (!docs || docs.length === 0) return null;

  return (
    <div className="mt-8 mb-6 pt-6 border-t border-slate-100">
      <div className="flex items-center gap-2 mb-4">
        <span className="flex items-center justify-center w-5 h-5 bg-slate-100 rounded-sm">
             <Paperclip size={12} className="text-slate-500" />
        </span>
        <h4 className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Technical Documentation
        </h4>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs.map((doc) => (
          <a 
            key={doc.id}
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col p-4 bg-slate-50 border border-slate-200 rounded-sm hover:bg-white hover:border-blue-400 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
                 <div className="p-2 bg-white border border-slate-200 rounded-sm group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                     <FileText size={18} />
                 </div>
                 <ExternalLink size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>
            
            <p className="font-sans font-medium text-slate-800 text-sm mb-1 line-clamp-2">
               {doc.title || doc.filename}
            </p>
            
            <div className="mt-auto pt-2 flex items-center gap-2">
                 <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-sm uppercase">
                    {doc.filename.split('.').pop() || 'FILE'}
                 </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// 2. Nested Accordion
function DeepNestedSection({ section }: { section: SectionData }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-4 border border-slate-200 rounded-sm bg-white hover:border-blue-300 transition-colors">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 md:p-5 text-left group"
      >
        <div className="flex items-center gap-3">
            <span className={cn(
                "w-1.5 h-1.5 rounded-full transition-colors",
                isOpen ? "bg-blue-600" : "bg-slate-300 group-hover:bg-blue-400"
            )} />
            <span className={cn(
                "font-display font-bold text-slate-800 text-sm md:text-base transition-colors",
                isOpen ? "text-blue-800" : "group-hover:text-blue-700"
            )}>
                {section.title}
            </span>
        </div>
        <ChevronDown 
          size={16} 
          className={cn("text-slate-400 transition-transform duration-300", isOpen && "rotate-180 text-blue-600")} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 md:px-6 md:pb-6 border-t border-slate-100 bg-slate-50/50">
              
              {/* IMAGE UPDATE: Removed border wrapper, added subtle ring for definition */}
              {section.images?.length > 0 && (
                <div className="mb-6 rounded-sm overflow-hidden ring-1 ring-black/5 bg-white">
                   <ImageCarousel images={section.images} />
                </div>
              )}
              
              <div 
                className="prose prose-sm prose-slate max-w-none text-slate-600 font-sans"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />

              <SectionDocuments docs={section.documents} />

              {section.children?.length > 0 && (
                <div className="mt-6 space-y-2 pl-4 border-l border-slate-200">
                  {section.children.map(child => (
                    <DeepNestedSection key={child.id} section={child} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 3. Feature Block (Alternating Grid)
function FeatureBlock({ section, index }: { section: SectionData; index: number }) {
  const isEven = index % 2 === 0;
  const hasImages = section.images && section.images.length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="py-16 md:py-24 border-b border-dashed border-slate-200 last:border-0"
    >
      <div className={cn(
        "flex flex-col gap-12 lg:gap-16",
        hasImages ? (isEven ? "lg:flex-row" : "lg:flex-row-reverse") : "lg:flex-col"
      )}>
        
        {/* Content Column */}
        <div className={cn("flex-1 min-w-0", hasImages ? "lg:w-1/2" : "w-full")}>
          <div className="flex items-center gap-3 mb-6">
             <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-sm uppercase tracking-wider">
                Specification 0{index + 1}
             </span>
             <div className="h-px flex-1 bg-slate-200"></div>
          </div>
          
          <h3 className="font-display text-2xl md:text-3xl font-bold text-slate-900 mb-6 leading-tight">
            {section.title}
          </h3>
          
          <div 
            className="prose prose-lg prose-slate text-slate-600 leading-relaxed max-w-none"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />

          <SectionDocuments docs={section.documents} />

          {section.children && section.children.length > 0 && (
            <div className="mt-10">
              <h4 className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Hash size={12} /> Detailed Breakdown
              </h4>
              <div className="space-y-3">
                  {section.children.map(child => (
                    <DeepNestedSection key={child.id} section={child} />
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Image Column */}
        {hasImages && (
          <div className="lg:w-1/2 w-full">
             <div className="sticky top-32">
                 {/* IMAGE UPDATE: Removed shadow-2xl, border, background padding, and decorative corners */}
                 <div className="relative rounded-sm overflow-hidden ring-1 ring-slate-900/5 bg-slate-50">
                    <ImageCarousel images={section.images} />
                 </div>
                 
                 <div className="mt-3 flex items-center justify-between px-1">
                     <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
                        Fig {index + 1}.0 - Visual Reference
                     </span>
                 </div>
             </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// 4. Root Section (Top Level)
function RootSection({ section, index }: { section: SectionData; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section 
      id={section.id} 
      ref={ref}
      className="mb-32 scroll-mt-32"
    >
      {/* Sticky Header for Section */}
      <div className="sticky top-[70px] z-30 bg-white/95 backdrop-blur-md py-6 border-b border-slate-200 mb-10 transition-all">
        <div className="flex items-center gap-4">
            <span className="flex items-center justify-center w-8 h-8 bg-slate-900 text-white font-mono text-sm font-bold rounded-sm shadow-md">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              {section.title}
            </h2>
        </div>
      </div>

      <div className="mb-16">
        {section.images && section.images.length > 0 && (
          // IMAGE UPDATE: Replaced shadow/border container with clean aspect-ratio container
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 rounded-sm overflow-hidden ring-1 ring-slate-900/5 aspect-video md:aspect-21/9 relative bg-slate-50"
          >
             <ImageCarousel images={section.images} />
          </motion.div>
        )}
        
        <div 
          className="prose prose-xl prose-slate max-w-4xl text-slate-700 leading-8 font-sans"
          dangerouslySetInnerHTML={{ __html: section.content }}
        />

        <SectionDocuments docs={section.documents} />
      </div>

      {/* Children Container */}
      <div className="pl-0 md:pl-8 border-l border-slate-200 md:ml-4 space-y-8">
        {section.children && section.children.map((child, idx) => (
          <FeatureBlock key={child.id} section={child} index={idx} />
        ))}
      </div>
    </section>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function DynamicPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [page, setPage] = useState<PageData | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data
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

  // 2. Scroll Spy Logic
  useEffect(() => {
    const handleScroll = () => {
      // Offset for header height
      const scrollPosition = window.scrollY + 250; 
      
      if(page?.sections) {
        for (const section of page.sections) {
          const element = document.getElementById(section.id);
          if (element) {
            const { offsetTop, offsetHeight } = element;
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              setActiveSectionId(section.id);
              break;
            }
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -150; // Adjusted offset for sticky headers
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // 3. Loading State
  if (loading) return (
    <div className="h-screen bg-slate-50 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
      <p className="font-mono text-xs text-slate-400 uppercase tracking-widest animate-pulse">Retrieving Data...</p>
    </div>
  );

  if (!page) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">404 - Page Not Found</h1>
        <p className="text-slate-500">The requested content does not exist.</p>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      
      {/* HERO SECTION */}
      <div className="bg-slate-950 text-white py-20 md:py-32 relative overflow-hidden">
         {/* Technical Background */}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]"></div>
         <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
         <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent"></div>
         
         <div className="container mx-auto px-6 relative z-10 max-w-7xl">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-white/10 bg-white/5 rounded-full backdrop-blur-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span className="font-mono text-[10px] font-bold text-blue-200 uppercase tracking-widest">Technical Overview</span>
                </div>
                
                <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
                {page.title}
                </h1>
                
                <div className="h-1 w-24 bg-blue-600 rounded-full"></div>
            </motion.div>
         </div>
      </div>

      <div className="container mx-auto px-6 py-16 flex flex-col lg:flex-row gap-16 max-w-7xl">
        
        {/* SIDEBAR NAVIGATION (Sticky) */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-[100px]">
            <div className="bg-white rounded-sm border border-slate-200 shadow-xl shadow-slate-200/50 p-6">
              <h3 className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                 <LayoutGrid size={12} /> Contents
              </h3>
              
              <nav className="relative">
                {/* Vertical Line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-slate-100" />
                
                <ul className="space-y-4">
                    {page.sections.map((section, idx) => (
                    <li key={section.id} className="relative z-10">
                        <button
                            onClick={() => scrollToSection(section.id)}
                            className={cn(
                            "group flex items-start gap-3 w-full text-left transition-all duration-200",
                            activeSectionId === section.id ? "opacity-100" : "opacity-60 hover:opacity-100"
                            )}
                        >
                            <span className={cn(
                                "flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold border shrink-0 transition-all duration-300 bg-white",
                                activeSectionId === section.id 
                                ? "border-blue-600 text-blue-600 scale-110 shadow-sm" 
                                : "border-slate-300 text-slate-400 group-hover:border-slate-400"
                            )}>
                                {idx + 1}
                            </span>
                            <span className={cn(
                                "text-sm font-medium pt-0.5 transition-colors",
                                activeSectionId === section.id ? "text-blue-700 font-bold" : "text-slate-600"
                            )}>
                                {section.title}
                            </span>
                        </button>
                    </li>
                    ))}
                </ul>
              </nav>

              <div className="mt-8 pt-6 border-t border-slate-100">
                 <p className="font-sans text-xs text-slate-400 leading-relaxed">
                    Need technical assistance with {page.title}?
                 </p>
                 <a href="/contact-us" className="inline-flex items-center gap-2 mt-3 text-xs font-bold text-blue-700 uppercase tracking-wider hover:underline">
                    Contact Engineering <ArrowRight size={12} />
                 </a>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0">
          {page.sections.length > 0 ? (
             page.sections.map((section, index) => (
                <RootSection key={section.id} section={section} index={index} />
             ))
          ) : (
             <div className="p-12 bg-slate-50 rounded-sm border border-slate-200 text-center text-slate-500">
                No content sections available.
             </div>
          )}
        </main>

      </div>
    </div>
  );
}