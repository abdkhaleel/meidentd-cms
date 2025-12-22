'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { ChevronDown, Menu, X, ArrowRight, Loader2 } from 'lucide-react';

// --- Types ---
type PageSummary = {
  id: string;
  title: string;
  slug: string;
};

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about-us' },
  { name: 'Products', href: '/products' },
  { name: 'Quality Policy', href: '/quality-policy' },
  { name: 'Contact', href: '/contact-us' },
  { name: 'Careers', href: 'https://meidensha.zohorecruit.in/jobs/Careers', external: true },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dynamicPages, setDynamicPages] = useState<PageSummary[]>([]);
  const [isHoveringMore, setIsHoveringMore] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { scrollY } = useScroll();
  const pathname = usePathname();

  // 1. Scroll Detection for Glassmorphism Effect
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = isScrolled;
    const current = latest > 10;
    if (previous !== current) setIsScrolled(current);
  });

  // 2. Fetch Dynamic Pages
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

  // 3. Lock Body Scroll on Mobile Menu Open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-sm border-slate-200/50 h-[70px]' 
            : 'bg-white h-20'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6 md:px-12 h-full flex items-center justify-between">
          
          {/* --- LOGO AREA --- */}
          <Link 
            href="/" 
            className="group flex flex-col justify-center"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className={`font-display font-black tracking-tight transition-colors duration-300 ${
              isScrolled ? 'text-2xl text-slate-900' : 'text-3xl text-slate-900'
            }`}>
              MEIDEN
            </span>
            <span className={`font-mono text-[10px] font-bold tracking-[0.2em] text-blue-600 uppercase transition-opacity duration-300 ${
              isScrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
            }`}>
              T&D India Limited
            </span>
          </Link>

          {/* --- DESKTOP NAV --- */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="relative px-4 py-2 group"
              >
                <span className={`relative z-10 text-sm font-bold tracking-wide transition-colors duration-200 ${
                  isActive(link.href) ? 'text-blue-700' : 'text-slate-600 group-hover:text-blue-600'
                }`}>
                  {link.name}
                </span>
                
                {/* Active Indicator (Shared Layout Animation) */}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}

            {/* Dynamic Dropdown */}
            {dynamicPages.length > 0 && (
              <div 
                className="relative ml-2"
                onMouseEnter={() => setIsHoveringMore(true)}
                onMouseLeave={() => setIsHoveringMore(false)}
              >
                <button 
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-bold tracking-wide rounded-full transition-all duration-200 ${
                    isHoveringMore || isActive('/more') 
                      ? 'bg-slate-100 text-blue-700' 
                      : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  More <ChevronDown size={14} className={`transition-transform duration-300 ${isHoveringMore ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isHoveringMore && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full pt-4 w-72"
                    >
                      <div className="bg-white rounded-lg shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden p-2">
                         <div className="px-4 py-2 border-b border-slate-100 mb-2">
                            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-widest">More Pages</span>
                         </div>
                         
                         {loading ? (
                            <div className="flex justify-center py-6 text-slate-400">
                                <Loader2 className="animate-spin" size={20} />
                            </div>
                         ) : (
                           <div className="max-h-64 overflow-y-auto custom-scrollbar">
                             {dynamicPages.map(page => (
                               <Link
                                 key={page.id}
                                 href={`/${page.slug}`}
                                 className="flex items-center justify-between px-4 py-3 rounded-md text-sm text-slate-600 font-medium hover:bg-slate-50 hover:text-blue-700 transition-colors group"
                               >
                                 {page.title}
                                 <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                               </Link>
                             ))}
                           </div>
                         )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            {/* CTA Button */}
            <div className="ml-6 pl-6 border-l border-slate-200">
                <Link href="/contact-us">
                    <button className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold tracking-widest uppercase hover:bg-blue-600 transition-colors duration-300">
                        Get Quote
                    </button>
                </Link>
            </div>
          </nav>

          {/* --- MOBILE TOGGLE --- */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
            aria-label="Toggle Navigation"
          >
             {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.header>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white lg:hidden pt-20"
          >
            <div className="h-full overflow-y-auto px-6 pb-20">
                <div className="flex flex-col space-y-1 mt-8">
                  {NAV_LINKS.map((link, idx) => (
                    <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                    >
                        <Link
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`
                            block py-4 text-2xl font-display font-bold border-b border-slate-100
                            ${isActive(link.href) ? 'text-blue-600 pl-4 border-l-4 border-blue-600 border-b-0 bg-slate-50' : 'text-slate-800'}
                        `}
                        >
                        {link.name}
                        </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile Dynamic Pages */}
                {dynamicPages.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8"
                    >
                        <h4 className="font-mono text-xs font-bold uppercase text-slate-400 tracking-widest mb-4">
                            More Information
                        </h4>
                        <div className="grid gap-2">
                            {dynamicPages.map(page => (
                                <Link
                                    key={page.id}
                                    href={`/${page.slug}`}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 bg-slate-50 rounded text-slate-600 font-medium hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                >
                                    {page.title}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12 p-6 bg-slate-900 rounded-lg text-center"
                >
                    <p className="text-slate-400 text-sm mb-4">Looking for custom solutions?</p>
                    <Link 
                        href="/contact-us"
                        onClick={() => setIsMenuOpen(false)}
                        className="block w-full py-3 bg-blue-600 text-white font-bold tracking-widest uppercase text-sm rounded hover:bg-blue-500 transition-colors"
                    >
                        Contact Sales
                    </Link>
                </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}