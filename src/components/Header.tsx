'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about-us' },
  { name: 'Products', href: '/products' },
  { name: 'Quality Policy', href: '/quality-policy' },
  { name: 'Contact', href: '/contact-us' },
  { name: 'Careers', href: 'https://meidensha.zohorecruit.in/jobs/Careers', external: true },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 z-50 w-full bg-white shadow-sm border-t-[3px] border-brand-bright">
      <div className="container mx-auto px-4 h-[70px] flex items-center justify-between">
        
        <Link 
          href="/" 
          className="text-2xl font-bold text-brand-bright tracking-tight hover:text-brand-primary transition-colors"
          onClick={() => setIsMenuOpen(false)}
        >
          MEIDEN
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              className={`
                px-4 py-2 text-sm font-medium transition-all duration-200 rounded-sm
                ${isActive(link.href) 
                  ? 'text-brand-primary font-bold border-b-2 border-brand-primary' 
                  : 'text-gray-secondary hover:text-brand-primary hover:bg-gray-50'
                }
              `}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-brand-primary p-2 focus:outline-none"
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

      {isMenuOpen && (
        <div className="md:hidden absolute top-[70px] left-0 w-full bg-white border-b border-gray-100 shadow-lg animate-in slide-in-from-top-5 duration-200">
          <nav className="flex flex-col py-4 px-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                onClick={() => setIsMenuOpen(false)}
                className={`
                  block px-4 py-3 text-sm font-medium rounded-md transition-colors
                  ${isActive(link.href) 
                    ? 'bg-brand-primary/10 text-brand-primary font-bold' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-brand-primary'
                  }
                `}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}