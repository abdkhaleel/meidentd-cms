'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, FileText, ShieldAlert, Link as LinkIcon, Globe, Scale } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- SUB-COMPONENTS ---

const Section = ({ id, title, index, icon: Icon, children }: { id: string; title: string; index: string; icon?: any; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-32 mb-20 relative group">
    <div className="flex items-start gap-5 border-b border-slate-200 pb-6 mb-8">
      <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 text-slate-400 font-mono font-bold text-lg shrink-0 border border-slate-100">
        {index}
      </span>
      <div className="pt-1">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          {title}
          {Icon && <Icon size={20} className="text-brand-primary opacity-50" />}
        </h2>
      </div>
    </div>
    <div className="pl-0 md:pl-16 space-y-6 text-slate-600 leading-7 text-justify text-[15px] md:text-base">
      {children}
    </div>
  </section>
);

const LegalList = ({ items }: { items: React.ReactNode[] }) => (
  <ol className="space-y-3 my-6 list-decimal pl-6 marker:text-brand-primary marker:font-bold text-slate-700 bg-slate-50 p-6 rounded-lg border border-slate-100">
    {items.map((item, idx) => (
      <li key={idx} className="pl-2">{item}</li>
    ))}
  </ol>
);

// --- MAIN PAGE ---

export default function TermsOfUsePage() {
  const [activeSection, setActiveSection] = useState<string>('intro');

  // Scroll Spy Logic
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['intro', 'usage', 'copyright', 'provision', 'disclaimer', 'links', 'linkage', 'global'];
      const scrollPosition = window.scrollY + 300; // Offset for better triggering

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section);
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'intro', label: 'Introduction' },
    { id: 'usage', label: 'Utilization Rules' },
    { id: 'copyright', label: 'Copyright' },
    { id: 'provision', label: 'Information Provision' },
    { id: 'disclaimer', label: 'Disclaimer' },
    { id: 'links', label: 'External Links' },
    { id: 'linkage', label: 'Linking Policy' },
    { id: 'global', label: 'Jurisdiction & Law' },
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* 1. Hero Section */}
      <div className="bg-slate-950 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <nav className="flex items-center text-xs font-medium text-slate-400 mb-8 uppercase tracking-widest" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} className="mx-2" />
            <span className="text-white">Terms of Use</span>
          </nav>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Terms of Use
            </h1>
            <p className="text-slate-400 text-lg max-w-3xl font-light leading-relaxed">
              Please read these terms carefully before utilizing the MEIDEN T&D (INDIA) LIMITED website.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 flex flex-col lg:flex-row gap-16">
        
        {/* 2. Sticky Sidebar (TOC) */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-28">
            <div className="bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest m-4 px-1 flex items-center gap-2">
                    <FileText size={12}/> Document Structure
                </h3>
                <nav className="space-y-0.5">
                  {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => scrollTo(item.id)}
                        className={cn(
                        "w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 border-l-[3px]",
                        activeSection === item.id 
                            ? "bg-blue-50 text-blue-700 border-blue-600" 
                            : "text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        {item.label}
                    </button>
                  ))}
                </nav>
            </div>
            
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-500 leading-relaxed">
                Last Updated: December 2024.<br/>
                These terms are subject to change without prior notice.
            </div>
          </div>
        </aside>

        {/* 3. Main Content */}
        <main className="flex-1 max-w-4xl min-w-0">
          
          {/* INTRO / PREAMBLE */}
          <section id="intro" className="scroll-mt-32 mb-16">
            <div className="prose prose-lg text-slate-600 leading-8 text-justify max-w-none">
              <p className="mb-6 font-medium text-slate-800">
                This website is managed by MEIDEN T&D (INDIA) LIMITED (&quot;Company&quot;) or its agents for the primary purpose of offering information to our customers. When a customer utilizes this website, the Company will assume that the accessing customer has consented to the terms of use specified below (&quot;Terms of Use&quot;). If a person is unwilling to consent to the Terms of Use, such user is hereby requested to refrain from browsing this website or utilizing any services offered, such as any downloads offered on the website.
              </p>
              <p>
                The Company may from time to time change or modify a part of or all of the terms and conditions of the Terms of Use. We request that each user or customer regularly review the Terms of Use for updates. Any such modification will take effect immediately at the time the modified Terms of Use are uploaded onto this website. The Company will assume that a customer or a user has agreed to such modified Terms of Use when a customer or a user accesses or views this website upon or after such modification takes effect. When there are any separate or special conditions for utilization in regard to specific services offered on this website, such separate or special conditions shall have priority.
              </p>
            </div>
          </section>

          <Section id="usage" title="Introduction to the utilization of our website" index="01">
            <p>
              In accordance with the Terms of Use, the Company will grant to our customers the right to browse this website and to view the information available therein by way of allowing access to the same and displaying the relevant information on the data terminal of a personal computer or the like at the customer&apos;s end. However, the right granted to the customer herein shall be non-exclusive and non-transferable. The customer shall be regarded as having consented to not disrupt the management of this website in any way. If a customer violates the Terms of Use, the Company will withdraw the above-mentioned right from such customer. In such case, the customer concerned shall immediately dispose of all information acquired from this website.
            </p>
          </Section>

          <Section id="copyright" title="Copyright" index="02" icon={Scale}>
            <p>
              Unless otherwise specified, the Company reserves the copyright to all documents and other contents presented in this website. Each user shall be aware that any action such as duplication, modification, reprint, etc. of the contents included in the website without permission from the Company is prohibited pursuant to the Copyright Act. The Company will not grant a license to any customer of any of the Company&apos;s rights in regard to copyright, patents, trademarks, and other intellectual properties belonging to the Company.
            </p>
            <p>
              When there are separate or special conditions for utilization stipulated in a particular document, such separate or special conditions shall have priority.
            </p>
          </Section>

          <Section id="provision" title="Provision of information" index="03">
            <p>
              The provision of confidential information by a customer or its agents through this website is prohibited. Any information provided by a customer to the Company through this website will be accepted under the assumption that the customer concerned has consented to the Company handling such information as non-confidential information.
            </p>
            <p>
              Any information provided by a customer or its agents to the Company through this website will be accepted under the assumption that the right to utilize such information has been given to the Company on a free of charge basis, which will be irrevocable and without any limitations. However, the personal information of each customer will be handled in accordance with the &quot;Privacy Policy&quot;, to be promulgated separately.
            </p>
            <p className="font-bold text-slate-800 mt-4">
              Any actions, including writing, that produces material which falls into any of the categories specified below shall be prohibited.
            </p>
            <LegalList items={[
                "Contents that could infringe the copyright or any other intellectual property belonging to the Company or a third party;",
                "Contents that could defame, calumniate, or threaten the Company or a third party;",
                "Contents that could be deemed to be the promotion of a business, advertisement, invitation, solicitation, etc.;",
                "Contents contrary to public order and morals;",
                "Contents that causes or could cause criminal acts or crimes; and",
                "Any other contents that could hinder the management of the website, as determined by the Company."
            ]} />
          </Section>

          <Section id="disclaimer" title="Disclaimer" index="04" icon={ShieldAlert}>
            <p>
              The Company pays utmost attention to the quality of the information displayed on this website, but the Company takes no responsibility in any way for the correctness, reliability, timeliness, usefulness, and fitness for a customer&apos;s purpose of such information, nor does the Company take responsibility for the safety and the functionality of this website itself. Unless otherwise specified in the specific terms and conditions for a particular service offered on this website, the Company takes no responsibility in any way for any damages accrued by the customer in relation to the customer&apos;s utilization of this website.
            </p>
          </Section>

          <Section id="links" title="Linkage" index="05" icon={LinkIcon}>
            <p>
              The Company shall in no way be responsible for any damages accrued by the customer in relation to the customer&apos;s utilization of a website linked to the Company&apos;s website (&quot;Link Site&quot;), or the contents acquired through the Link Site. When a customer utilizes a Link Site, the customer shall be required to comply with the terms of use stipulated by such Link Site.
            </p>
            <p>
              The presence of a link to a Link Site on this website does not imply the Company&apos;s utilization of such Link Site, nor does it imply any business relationship between the Company and the person or organization that manages the Link Site, or the merchandise or services, etc. displayed on the Link Site.
            </p>
          </Section>

          <Section id="linkage" title="Linkage with this website" index="06">
            <p>
              When linking to this website via a website other than the Company&apos;s website, no particular statement to report that fact to the Company is required. However, the user will be deemed to understand and agree that the Company may demand the cancelation of the link to the Company&apos;s website when the Company determines such linkage to be undesirable.
            </p>
            <p className="font-bold text-slate-800 mt-4">Any linkage from a website which falls into or could fall into any of the following categories will be rejected:</p>
            
            <LegalList items={[
                "Linkage from a website that defames or calumniates the Company, its associated companies, or a third party;",
                "Linkage from a website that impairs the Company's credibility, reputation, or dignity, such as websites contrary to public order and morality;",
                "Linkage from a website that contains illegal or possibly illegal contents, or is concerned with illegal or possibly illegal activities; and",
                "Linkage that may give rise to a misconception of any possible affiliated or cooperative relationship with the Company, or a misconception that the Company is acknowledging or supporting the website containing the original linkage."
            ]} />

            <div className="mt-6 p-5 bg-blue-50/50 border border-blue-100 rounded-lg">
                <p className="text-slate-700">
                    The Company shall not be responsible in any way for any complaints, claims, or other similar petitions from a customer or a third party related to a customer website that falls into any of the above categories. Each user will hold harmless and cause no damage to the Company. The Company has promulgated a separate &quot;Privacy Policy&quot; which each customer is requested to read.
                </p>
            </div>
          </Section>

          <Section id="global" title="Utilization outside India and applicable laws" index="07" icon={Globe}>
            <p>
              This website is managed and controlled within the territory of India by the Company. The Company makes no declaration or representation in regard to whether activities such as acquiring information on this website or making access available to this website are permissible, legally valid, or possible in any other country or area outside of India. The establishment, effectiveness, enforceability, fulfilment, and interpretation of the Terms of Use will be governed by the laws of India. Should any necessity for any litigation arise in regard to this website between a customer and the Company, India Court shall have exclusive jurisdiction as the court of first instance.
            </p>
            
            <div className="mt-8 border-t border-slate-200 pt-6">
                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                    Trademarks of other companies
                </h4>
                <ul className="list-disc pl-6 space-y-2 text-sm text-slate-500">
                    <li>Adobe and an Adobe logo are either registered trademarks or trademarks of Adobe Systems Incorporated in the United States and/or other countries.</li>
                    <li>Microsoft, Windows, Windows Vista, Aero, Excel, Outlook, PowerPoint, Windows Media, a Windows logo, a Windows start logo, and an Office logo are either registered trademarks or trademarks of Microsoft Corporation in the United States and/or other countries.</li>
                </ul>
                <p className="mt-4 text-sm text-slate-500">
                    In addition, the corporate names or product names, etc. are either trade names, or trademarks or registered trademarks of the respective owners.
                </p>
                <p className="mt-2 text-sm text-slate-500">
                    Further, in case trademarks are individually shown in the web page of this site, the terms and conditions of the trademarks of the other companies shown here shall prevail.
                </p>
            </div>
          </Section>

        </main>
      </div>
    </div>
  );
}