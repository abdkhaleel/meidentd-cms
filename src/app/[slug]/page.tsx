'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; 
import { ChevronRight } from 'lucide-react';
import ImageCarousel from '@/components/ImageCarousel'; // Import the carousel
import type { SectionData } from '@/components/AccordionSection'; // Re-using type

type PageData = {
  title: string;
  sections: SectionData[];
};

export default function DynamicPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [page, setPage] = useState<PageData | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    async function getPageData() {
      try {
        const res = await fetch(`/api/pages/${slug}`);
        if (!res.ok) { setPage(null); return; }
        
        const data = await res.json();
        setPage(data);
        
        // Default to selecting the first section automatically
        if (data.sections && data.sections.length > 0) {
          setActiveSectionId(data.sections[0].id);
        }

      } catch (error) {
        console.error("Failed to fetch page data:", error);
        setPage(null);
      } finally {
        setLoading(false);
      }
    }
    getPageData();
  }, [slug]); 

  // --- Helper to get the actual active section object ---
  const activeSection = page?.sections.find(s => s.id === activeSectionId);

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-bright border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">Loading content...</p>
      </div>
    );
  }

  // --- Error State ---
  if (!page) return <div className="container mx-auto py-12 px-4 text-center">Page not found.</div>;

  return (
    <div className="container mx-auto py-12 px-4">
      
      {/* Page Main Title */}
      <div className="mb-12 border-b border-gray-200 pb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-primary">
          {page.title}
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN: Interactive Sidebar Navigation */}
        <aside className="w-full lg:w-1/4 shrink-0">
          <div className="sticky top-24">
            <div className="bg-brand-secondary text-white p-4 font-bold text-lg rounded-t-sm">
              In This Section
            </div>
            <div className="border border-gray-200 border-t-0 bg-gray-50 rounded-b-sm shadow-sm">
              <ul className="divide-y divide-gray-200">
                {page.sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => setActiveSectionId(section.id)}
                      className={`
                        w-full text-left px-5 py-4 text-sm font-medium transition-all duration-200 flex justify-between items-center
                        ${activeSectionId === section.id 
                          ? 'bg-white text-brand-primary border-l-4 border-brand-primary shadow-sm' 
                          : 'text-gray-secondary hover:bg-gray-200 hover:text-brand-primary'
                        }
                      `}
                    >
                      {section.title}
                      {activeSectionId === section.id && <ChevronRight size={16} />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: Dynamic Content Area */}
        <main className="w-full lg:w-3/4 min-h-[500px]">
          {activeSection ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              
              {/* 1. Section Title */}
              <h2 className="text-2xl font-bold text-brand-primary mb-6">
                {activeSection.title}
              </h2>

              {/* 2. Image Carousel (Slideshow) */}
              <ImageCarousel images={activeSection.images} />

              {/* 3. Rich Text Content */}
              <div 
                className="prose-brand mb-10"
                dangerouslySetInnerHTML={{ __html: activeSection.content }}
              />

              {/* 4. Child Sections (if any exist, render them as simple blocks below) */}
              {activeSection.children && activeSection.children.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-gray-secondary mb-6">Related Topics</h3>
                  <div className="grid gap-6">
                    {activeSection.children.map(child => (
                      <div key={child.id} className="bg-gray-50 p-6 rounded border border-gray-200">
                        <h4 className="text-lg font-bold text-brand-secondary mb-2">{child.title}</h4>
                        <div 
                          className="prose-brand prose-sm"
                          dangerouslySetInnerHTML={{ __html: child.content }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">Select a section to view details.</div>
          )}
        </main>

      </div>
    </div>
  );
}