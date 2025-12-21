'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Loader2 } from 'lucide-react';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about-us' },
  { name: 'Products', href: '/products' },
  { name: 'Quality Policy', href: '/quality-policy' },
  { name: 'Contact', href: '/contact-us' },
  { name: 'Careers', href: 'https://meidensha.zohorecruit.in/jobs/Careers', external: true },
];

type PageSummary = {
  id: string;
  title: string;
  slug: string;
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dynamicPages, setDynamicPages] = useState<PageSummary[]>([]);
  const [isMoreOpen, setIsMoreOpen] = useState(false); 
  const [loading, setLoading] = useState(true);
  
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        const desktopDropdown = document.getElementById('desktop-more-dropdown');
        if (desktopDropdown) desktopDropdown.style.opacity = '0';
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchPages() {
      try {
        const res = await fetch('/api/pages');
        if (res.ok) {
          const pages: PageSummary[] = await res.json();
          const staticSlugs = new Set(NAV_LINKS.map(link => link.href.replace(/^\//, '')));
          const filtered = pages.filter(page => !staticSlugs.has(page.slug));
          setDynamicPages(filtered);
        }
      } catch (error) {
        console.error("Failed to load navigation", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPages();
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-sm border-t-[3px] border-brand-bright transition-all duration-300">
      <div className="container mx-auto px-4 h-[70px] flex items-center justify-between">
        
        <Link 
          href="/" 
          className="text-2xl font-bold text-brand-bright tracking-tight hover:text-brand-primary transition-colors"
          onClick={() => setIsMenuOpen(false)}
        >
          MEIDEN
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className={`
                relative px-3 py-2 text-sm font-medium transition-all duration-200 rounded-md group
                ${isActive(link.href) 
                  ? 'text-brand-primary font-bold bg-brand-primary/5' 
                  : 'text-gray-600 hover:text-brand-primary hover:bg-gray-50'
                }
              `}
            >
              {link.name}
              {isActive(link.href) && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand-primary rounded-full" />
              )}
            </Link>
          ))}

          {dynamicPages.length > 0 && (
            <div className="relative group ml-1" ref={dropdownRef}>
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-brand-primary hover:bg-gray-50 transition-all">
                More <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
              </button>

              <div 
                id="desktop-more-dropdown"
                className="absolute right-0 top-full pt-2 w-56 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200 ease-out"
              >
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden p-1.5">
                  {loading ? (
                     <div className="flex items-center justify-center py-4 text-gray-400">
                        <Loader2 className="animate-spin w-4 h-4" />
                     </div>
                  ) : (
                    dynamicPages.map(page => (
                      <Link
                        key={page.id}
                        href={`/${page.slug}`}
                        className={`
                          block px-4 py-2.5 text-sm rounded-lg transition-colors
                          ${isActive(`/${page.slug}`)
                            ? 'bg-brand-primary/10 text-brand-primary font-bold'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-brand-primary'
                          }
                        `}
                      >
                        {page.title}
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>

        <div className="lg:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 hover:text-brand-primary p-2 focus:outline-none transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div 
        className={`
          lg:hidden absolute top-[70px] left-0 w-full bg-white border-b border-gray-100 shadow-xl 
          overflow-hidden transition-all duration-300 ease-in-out
          ${isMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <nav className="flex flex-col py-2 px-4 space-y-1 overflow-y-auto max-h-[75vh]">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              onClick={() => setIsMenuOpen(false)}
              className={`
                block px-4 py-3 text-sm font-medium rounded-lg transition-all
                ${isActive(link.href) 
                  ? 'bg-brand-primary/10 text-brand-primary font-bold pl-5 border-l-4 border-brand-primary' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-brand-primary hover:pl-5'
                }
              `}
            >
              {link.name}
            </Link>
          ))}

          {dynamicPages.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <button 
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-gray-500 hover:text-brand-primary hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span>More Pages</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-300 ${isMoreOpen ? 'rotate-180 text-brand-primary' : ''}`} 
                />
              </button>

              <div 
                className={`
                  space-y-1 overflow-hidden transition-all duration-300
                  ${isMoreOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}
                `}
              >
                {dynamicPages.map(page => (
                  <Link
                    key={page.id}
                    href={`/${page.slug}`}
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      block px-4 py-2.5 ml-4 text-sm rounded-lg transition-all border-l-2 border-transparent
                      ${isActive(`/${page.slug}`)
                        ? 'text-brand-primary font-semibold border-brand-primary/30 bg-gray-50'
                        : 'text-gray-500 hover:text-brand-secondary hover:border-gray-300'
                      }
                    `}
                  >
                    {page.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}