// src/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto w-full bg-white border-t-2 border-gray-muted py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        
        {/* Copyright Text - Matches original .footer-copyright p styling */}
        <p className="text-xs text-gray-400 text-center md:text-left">
          &copy; {new Date().getFullYear()} Meiden. All Rights Reserved.
        </p>

        {/* Optional Footer Links - Matches original .footer-menu styling */}
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link 
            href="/privacy-policy" 
            className="text-xs text-gray-400 hover:text-brand-primary transition-colors"
          >
            Privacy Policy
          </Link>
          <Link 
            href="/terms" 
            className="text-xs text-gray-400 hover:text-brand-primary transition-colors"
          >
            Terms of Use
          </Link>
        </div>

      </div>
    </footer>
  );
}