'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  // Helper to check active state
  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 z-50 w-full bg-white shadow-sm border-t-[3px] border-brand-bright">
      {/* 
        Container matches global max-width settings. 
        "h-[70px]" aligns with the original site's height feel but flexible.
      */}
      <div className="container mx-auto px-4 h-[70px] flex items-center justify-between">
        
        {/* Logo Area */}
        <Link href="/" className="text-2xl font-bold text-gray-body tracking-tight hover:text-brand-primary transition-colors">
          Meiden
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {[
            { name: 'Home', href: '/' },
            { name: 'About Us', href: '/about-us' },
            { name: 'Products', href: '/products' },
            { name: 'Quality', href: '/quality' },
            { name: 'Contact', href: '/contact' },
            { name: 'Careers', href: '/careers' },
          ].map((link) => (
            <Link
              key={link.name}
              href={link.href}
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

        {/* Mobile Menu Button (Placeholder for future use) */}
        <div className="md:hidden">
          <button className="text-brand-primary p-2">
            <span className="sr-only">Open menu</span>
            {/* Simple hamburger icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

      </div>
    </header>
  );
}