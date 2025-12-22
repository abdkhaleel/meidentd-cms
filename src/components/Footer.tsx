'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, ArrowUpRight, Linkedin, Facebook, Twitter, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 text-slate-400 font-sans">
      
      {/* --- UPPER CTA SECTION --- */}
      <div className="border-b border-white/5 bg-slate-900/50">
        <div className="container mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
                <h3 className="font-display text-2xl text-white font-bold tracking-tight mb-2">
                    Ready to electrify the future?
                </h3>
                <p className="text-sm text-slate-400">
                    Contact our engineering team for custom T&D solutions.
                </p>
            </div>
            <Link href="/contact-us">
                <button className="group flex items-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-600 text-white text-xs font-mono font-bold tracking-[0.2em] uppercase transition-all">
                    Get in Touch
                    <ArrowUpRight size={16} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
            </Link>
        </div>
      </div>

      {/* --- MAIN GRID CONTENT --- */}
      <div className="container mx-auto px-6 md:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* COLUMN 1: BRAND IDENTITY */}
          <div className="lg:col-span-4 space-y-8">
            <Link href='/' className="block relative w-48 h-12">
               {/* 
                 NOTE: If your logo is dark text, apply 'brightness-0 invert' to class below.
                 If it's already white, remove the filter.
               */}
               <Image 
                src="/images/logo.png" 
                alt="Meiden T&D India Logo"
                fill
                className="object-contain object-left brightness-0 invert opacity-90"
              />
            </Link>

            <p className="text-sm leading-relaxed max-w-sm font-light text-slate-400">
              A strategic subsidiary of Meidensha Corporation, Japan. Delivering world-class power transmission and distribution technology to India's industrial core since 2008.
            </p>

            <div className="flex items-center gap-4">
                <SocialLink href="#" icon={<Linkedin size={18} />} label="LinkedIn" />
                <SocialLink href="#" icon={<Twitter size={18} />} label="Twitter" />
                <SocialLink href="#" icon={<Facebook size={18} />} label="Facebook" />
            </div>
          </div>

          {/* COLUMN 2: SITEMAP */}
          <div className="lg:col-span-2 lg:col-start-6">
            <FooterHeader>Company</FooterHeader>
            <ul className="space-y-3">
                <FooterLink href="/about-us">About Us</FooterLink>
                <FooterLink href="/products">Products & Solutions</FooterLink>
                <FooterLink href="/quality-policy">Quality Policy</FooterLink>
                <FooterLink href="https://meidensha.zohorecruit.in/jobs/Careers" external>Careers</FooterLink>
            </ul>
          </div>

          {/* COLUMN 3: LEGAL & SUPPORT */}
          <div className="lg:col-span-2">
            <FooterHeader>Legal</FooterHeader>
            <ul className="space-y-3">
                <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
                <FooterLink href="/terms">Terms of Use</FooterLink>
                {/* <FooterLink href="/compliance">Compliance</FooterLink>
                <FooterLink href="/sitemap">Sitemap</FooterLink> */}
            </ul>
          </div>

          {/* COLUMN 4: CONTACT DATA */}
          <div className="lg:col-span-3">
            <FooterHeader>Headquarters</FooterHeader>
            <div className="space-y-4 text-sm font-light">
                <div className="flex items-start gap-3">
                    <MapPin className="text-blue-600 mt-1 shrink-0" size={16} />
                    <span>
                        Unit No. 01, 12th Floor,<br />
                        Building No. 9B, DLF Cyber City,<br />
                        Phase III, Gurgaon - 122002, India
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <Phone className="text-blue-600 shrink-0" size={16} />
                    <a href="tel:+911244389600" className="hover:text-white transition-colors">+91 124 438 9600</a>
                </div>
                <div className="flex items-center gap-3">
                    <Mail className="text-blue-600 shrink-0" size={16} />
                    <a href="mailto:info@meiden.com" className="hover:text-white transition-colors">info@meidensha.com</a>
                </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- BOTTOM BAR --- */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="container mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex flex-col md:flex-row items-center gap-4 text-xs font-mono text-slate-500 uppercase tracking-wide">
                <span>&copy; {currentYear} Meiden T&D (India) Ltd.</span>
                <span className="hidden md:block text-slate-700">|</span>
                <span>All Rights Reserved.</span>
            </div>

            <div className="flex items-center gap-6">
                <a 
                    href="https://www.meidensha.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors"
                >
                    <span className="uppercase tracking-widest">Meidensha Global</span>
                    <ExternalLink size={12} className="opacity-50 group-hover:opacity-100" />
                </a>
                
                <button 
                    onClick={scrollToTop}
                    className="p-2 bg-slate-800 hover:bg-blue-700 text-white rounded-sm transition-colors"
                    aria-label="Scroll to top"
                >
                    <ArrowUpRight size={16} className="-rotate-45" />
                </button>
            </div>

        </div>
      </div>

    </footer>
  );
}

// --- SUB-COMPONENTS FOR CONSISTENCY ---

function FooterHeader({ children }: { children: React.ReactNode }) {
    return (
        <h4 className="font-mono text-xs font-bold text-white uppercase tracking-[0.15em] mb-6">
            {children}
        </h4>
    );
}

function FooterLink({ href, children, external }: { href: string, children: React.ReactNode, external?: boolean }) {
    return (
        <li>
            <Link 
                href={href} 
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors"
            >
                <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300 h-px bg-blue-500"></span>
                {children}
            </Link>
        </li>
    );
}

function SocialLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
    return (
        <a 
            href={href}
            aria-label={label}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
        >
            {icon}
        </a>
    );
}