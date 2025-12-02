'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, LayoutGrid, FileText, Download, ExternalLink, Paperclip } from 'lucide-react';
import ImageCarousel from '@/components/ImageCarousel';
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

function SectionDocuments({ docs }: { docs: DocumentData[] }) {
  if (!docs || docs.length === 0) return null;

  return (
    <div className="mt-8 mb-6">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
        <Paperclip size={16} className="text-brand-primary" />
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Attached Documents
        </h4>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {docs.map((doc) => (
          <a 
            key={doc.id}
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-brand-primary/50 hover:shadow-md transition-all duration-200"
          >
            <div className="p-2 bg-blue-50 text-blue-600 rounded-md group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <FileText size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-700 truncate group-hover:text-brand-primary transition-colors">
                {doc.title || doc.filename}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-gray-400 font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                  {doc.filename.split('.').pop()?.toUpperCase() || 'FILE'}
                </span>
                <span className="text-[10px] text-gray-400 flex items-center gap-1 group-hover:text-brand-secondary transition-colors">
                  View File <ExternalLink size={10} />
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function DeepNestedSection({ section }: { section: SectionData }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 transition-colors text-left"
      >
        <span className="font-bold text-brand-secondary text-sm md:text-base flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
          {section.title}
        </span>
        <ChevronDown 
          size={18} 
          className={cn("text-gray-400 transition-transform duration-300", isOpen && "rotate-180 text-brand-primary")} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-5 border-t border-gray-100">
              {section.images?.length > 0 && (
                <div className="mb-6 w-full">
                   <ImageCarousel images={section.images} />
                </div>
              )}
              
              <div 
                className="prose-brand prose-sm text-gray-600"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />

              <SectionDocuments docs={section.documents} />

              {section.children?.length > 0 && (
                <div className="pl-4 mt-4 border-l-2 border-gray-100 space-y-2">
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

function FeatureBlock({ section, index }: { section: SectionData; index: number }) {
  const isEven = index % 2 === 0;
  const hasImages = section.images && section.images.length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="group relative py-12 md:py-20 border-b border-gray-100 last:border-0"
    >
      <div className={cn(
        "flex flex-col gap-10",
        hasImages ? (isEven ? "lg:flex-row" : "lg:flex-row-reverse") : "lg:flex-col"
      )}>
        
        <div className={cn("flex-1 min-w-0", hasImages ? "lg:w-1/2" : "w-full")}>
          <div className="flex items-center gap-2 mb-4 opacity-60">
             <LayoutGrid size={16} className="text-brand-primary" />
             <span className="text-xs font-bold tracking-widest text-brand-primary uppercase">Topic 0{index + 1}</span>
          </div>
          
          <h3 className="text-2xl md:text-3xl font-bold text-brand-secondary mb-6 group-hover:text-brand-primary transition-colors">
            {section.title}
          </h3>
          
          <div 
            className="prose-brand prose-lg text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />

          <SectionDocuments docs={section.documents} />

          {section.children && section.children.length > 0 && (
            <div className="mt-8 space-y-3">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">In Detail</h4>
              {section.children.map(child => (
                <DeepNestedSection key={child.id} section={child} />
              ))}
            </div>
          )}
        </div>

        {hasImages && (
          <div className="lg:w-1/2 relative w-full">
             <div className={cn(
               "relative rounded-xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-gray-100 bg-gray-100",
               isEven ? "lg:rotate-1" : "lg:-rotate-1"
             )}>
               <ImageCarousel images={section.images} />
             </div>
             
             <div className={cn(
               "absolute -bottom-6 -z-10 w-full h-full bg-brand-primary/5 rounded-xl",
               isEven ? "-right-6" : "-left-6"
             )}></div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function RootSection({ section, index }: { section: SectionData; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section 
      id={section.id} 
      ref={ref}
      className="mb-24 scroll-mt-32"
    >
      <div className="sticky top-18 z-20 bg-white/90 backdrop-blur-md py-4 border-b border-brand-primary/10 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 bg-brand-secondary text-white font-mono text-sm rounded-lg shadow-md">
              {index + 1}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-secondary tracking-tight">
              {section.title}
            </h2>
          </div>
          <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-brand-primary/20 to-transparent ml-6"></div>
        </div>
      </div>

      <div className="mb-12">
        {section.images && section.images.length > 0 && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-8 rounded-2xl overflow-hidden shadow-xl relative w-full bg-gray-50 border border-gray-100"
          >
             <ImageCarousel images={section.images} />
          </motion.div>
        )}
        
        <div 
          className="prose-brand prose-xl max-w-4xl text-gray-700 leading-loose"
          dangerouslySetInnerHTML={{ __html: section.content }}
        />

        <SectionDocuments docs={section.documents} />
      </div>

      <div className="pl-0 md:pl-4 border-l-2 border-dashed border-gray-200 space-y-8">
        {section.children && section.children.map((child, idx) => (
          <FeatureBlock key={child.id} section={child} index={idx} />
        ))}
      </div>

    </section>
  );
}

export default function DynamicPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [page, setPage] = useState<PageData | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>("");
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; 
      let currentId = activeSectionId;
      
      if(page?.sections) {
        for (const section of page.sections) {
          const element = document.getElementById(section.id);
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -140; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-blue-100 border-t-brand-primary rounded-full animate-spin mb-4"></div>
      <p className="text-gray-400 animate-pulse">Loading content...</p>
    </div>
  );

  if (!page) return <div className="text-center py-20 text-gray-500">Page not found.</div>;

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-brand-secondary text-white py-16 md:py-24 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-primary/50 rounded-full blur-3xl"></div>
         <div className="container mx-auto px-4 relative z-10">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl md:text-6xl text-white font-bold tracking-tight mb-4"
            >
              {page.title}
            </motion.h1>
            <div className="h-1 w-20 bg-brand-bright rounded-full"></div>
         </div>
      </div>

      <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-16">
        
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-32">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2 flex items-center gap-2">
                 On This Page
              </h3>
              <nav className="space-y-1 relative">
                <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200 rounded-full" />
                
                {page.sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      "relative w-full text-left py-2 pl-6 pr-2 text-sm font-medium transition-all duration-300 rounded-md",
                      activeSectionId === section.id 
                        ? "text-brand-primary font-bold bg-white shadow-sm" 
                        : "text-gray-500 hover:text-brand-secondary hover:pl-7"
                    )}
                  >
                    {activeSectionId === section.id && (
                      <motion.div
                        layoutId="sidebar-indicator"
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-brand-primary rounded-full ring-2 ring-blue-100"
                      />
                    )}
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          {page.sections.map((section, index) => (
            <RootSection key={section.id} section={section} index={index} />
          ))}
        </main>

      </div>
    </div>
  );
}