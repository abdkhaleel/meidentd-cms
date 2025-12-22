'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExternalLink, ChevronRight, Phone, MapPin, Globe, ArrowRight, FileText } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- SUB-COMPONENTS ---

const Section = ({ id, title, index, children }: { id: string; title: string; index: string; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-32 mb-20 relative group">
    <div className="flex items-baseline gap-4 border-b border-slate-200 pb-6 mb-10">
      <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 text-brand-primary font-display font-black text-2xl shrink-0">
        {index}
      </span>
      <h2 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">
        {title}
      </h2>
    </div>
    <div className="pl-0 md:pl-16 space-y-6 text-slate-600 leading-7 text-base">
      {children}
    </div>
  </section>
);

const Subsection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-10 last:mb-0">
    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-3">
      <div className="w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" />
      {title}
    </h3>
    <div className="space-y-4 text-justify">{children}</div>
  </div>
);

const LegalList = ({ items }: { items: React.ReactNode[] }) => (
  <ol className="space-y-3 my-4 list-decimal pl-6 marker:text-slate-400 marker:font-bold">
    {items.map((item, idx) => (
      <li key={idx} className="pl-2">{item}</li>
    ))}
  </ol>
);

// Styled version of your original table
const ContactGrid = () => (
  <div className="grid md:grid-cols-2 gap-4 not-prose mt-6">
    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-brand-primary/30 transition-colors">
      <div className="flex items-center gap-2 mb-3 text-brand-primary">
        <MapPin size={18} />
        <span className="font-bold text-xs uppercase tracking-widest">Mailing Address</span>
      </div>
      <p className="text-slate-700 text-sm leading-relaxed font-medium">
        MEIDEN T&D (INDIA) LIMITED<br />
        Building No. 10, Tower C, 1st Floor,<br />
        DLF Cyber City, Phase - II,<br />
        Gurgaon-122002, Haryana, India
      </p>
    </div>
    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-brand-primary/30 transition-colors">
      <div className="flex items-center gap-2 mb-3 text-brand-primary">
        <Phone size={18} />
        <span className="font-bold text-xs uppercase tracking-widest">Telephone</span>
      </div>
      <p className="text-lg font-bold text-slate-900">
        +91-124-4549830
      </p>
    </div>
  </div>
);

// Styled wrapper for the "Rights" section
const RightItem = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="flex gap-4 p-5 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-all">
    <div className="mt-1 shrink-0">
        <div className="w-2 h-2 bg-blue-500 rounded-full" />
    </div>
    <div>
        <h5 className="font-bold text-slate-900 text-base mb-2">{label}</h5>
        <div className="text-sm text-slate-600 leading-relaxed text-justify">
            {children}
        </div>
    </div>
  </div>
);

// --- MAIN PAGE ---

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState<string>('basic-policy');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['basic-policy', 'website-data'];
      const scrollPosition = window.scrollY + 250;

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
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

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
            <span className="text-white">Privacy Policy</span>
          </nav>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl font-light leading-relaxed">
            Our policy regarding the acquisition, management, and utilization of personal data.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 flex flex-col lg:flex-row gap-16">
        
        {/* 2. Sticky Table of Contents */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-28">
            <div className="bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest m-4 px-1 flex items-center gap-2">
                    <FileText size={12}/> Contents
                </h3>
                <nav className="space-y-1">
                <button
                    onClick={() => scrollTo('basic-policy')}
                    className={cn(
                    "w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 border-l-2",
                    activeSection === 'basic-policy' 
                        ? "bg-slate-50 text-brand-primary border-brand-primary" 
                        : "text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-900"
                    )}
                >
                    1. Basic policy
                </button>
                <button
                    onClick={() => scrollTo('website-data')}
                    className={cn(
                    "w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 border-l-2",
                    activeSection === 'website-data' 
                        ? "bg-slate-50 text-brand-primary border-brand-primary" 
                        : "text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-900"
                    )}
                >
                    2. Personal Data Regarding our Website Users
                </button>
                </nav>
            </div>
          </div>
        </aside>

        {/* 3. Main Content */}
        <main className="flex-1 max-w-4xl min-w-0">
          
          {/* SECTION 1 */}
          <Section id="basic-policy" title="Basic policy" index="1.">
            <p className="lead text-lg font-medium text-slate-700">
              Meiden T&D India limited (&quot;we/us/our&quot;) understands that properly handling and managing information which could identify specific individuals (&quot;Personal Data&quot;) is socially expected and an important responsibility of a company as it aims to engage in fair and good faith corporate activities, as well as being necessary in order for a company to strictly comply with the Act on the Protection of Personal Information. Therefore, in an effort to strengthen the relationship of trust between us and society as a whole, and in an effort to fulfill its social obligations, we promulgates this privacy policy (&quot;Privacy Policy&quot;), and will handle Personal Data in accordance with this Privacy Policy.
            </p>

            <Subsection title="(1) Acquisition of Personal Data">
              <p>
                When you visit our website, our web servers automatically record the IP address of your Internet service provider, the website from which you visit us, the pages on our website you visit and the date and duration of your visit. This information is absolutely necessary for the technical transmission of the web pages and the secure server operation. A personalized evaluation of this data does not take place.
              </p>
              <p>
                If you send us data via contact form, this data will be stored on our servers in the course of data backup. Your data will only be used by us to process your request. Your data will be treated strictly confidential. Your data will not be passed on to third parties.
              </p>
            </Subsection>

            <Subsection title="(2) Management of Personal Data">
              <p>
                Personal data is data about your person. This includes your name, address and email address. You also do not need to provide any personal information to visit our website. In some cases we need your name and address as well as further information to be able to offer you the desired service.
              </p>
              <p>
                The same applies in the event that we supply you with information material on request or when we answer your enquiries. In these cases we will always point this out to you. In addition, we only store data that you have transmitted to us automatically or voluntarily.
              </p>
              <p>
                When you use one of our services, we usually only collect the information that is necessary to provide you with our service. We may ask you for further information, which is voluntary in nature. Whenever we process personal information, we do so in order to provide you with our service or to pursue our commercial purposes. The data collected for the purpose of processing the inquiries and which are not in a business relationship will be deleted within one year.
              </p>
            </Subsection>

            <Subsection title="(3) Utilization of Personal Data">
              <p>
                When acquiring Personal Data, we will clarify the intended purpose of the utilization of the information, and use the information only to the extent necessary for achieving this purpose and performing our business.
              </p>
            </Subsection>

            <Subsection title="(4) Provision of Personal Data">
              <p>We will not disclose or provide Personal Data to any third parties except in the following cases:</p>
              <LegalList items={[
                "When the affected person has given prior consent to the disclosure of his/her Personal Data;",
                "When disclosure of such Personal Data is necessary to protect human life, safety, or property, but where it is difficult to obtain permission from the affected person for the use of such person's Personal Data;",
                "When complying with laws and regulations;",
                "When entrusting the handling of Personal Data to a third party to the extent that it is necessary to achieve the purpose intended in the usage of such Personal Data. In such case, we shall exercise necessary and appropriate supervision over the entrustee to ensure the secure control of the entrusted Personal Data;",
                "When sharing Personal Data with our group companies, sales agents, or other companies, and where the joint use of said Personal Data is necessary to achieve the purpose intended in the usage of such Personal Data. In such case, we will assume responsibility for managing the Personal Data; and",
                "When another entity succeeds to our business due to a merger, corporate separation, transfer of business, or otherwise."
              ]} />
            </Subsection>

            <Subsection title="(5) Response to Requests Relating to Personal Data">
              <p>
                We will respond promptly and in accordance with relevant laws and regulations to requests relating to Personal Data, including requests for the disclosure, correction, addition, deletion, cessation of use, or purge of Personal Data.
              </p>
            </Subsection>

            <Subsection title="(6) Implementation, Improvement and Revision of the Privacy Policy">
              <p>
                In order to strictly comply with the Act on the Protection of Personal Information and related ordinances, guidelines set out by the government, and other relevant rules and regulations, and to implement the Privacy Policy, we will establish internal rules and regulations, etc., in addition to the Privacy Policy, and will ensure that all our employees and other persons concerned recognize the importance of such rules and regulations and comply with them, while continuously reviewing and improving the same.
              </p>
            </Subsection>

            <Subsection title="(7) Inquiries Concerning Personal Data">
              <ContactGrid />
            </Subsection>
          </Section>

          {/* SECTION 2 */}
          <Section id="website-data" title="Personal Data Regarding our Website Users" index="2.">
            
            <Subsection title="(1) Acquisition of Personal Data">
                <p className="mb-4">The provider of the pages automatically collects and stores information in so-called server log files, which your browser automatically transmits to us. These are:</p>
                <ul className="list-disc pl-6 space-y-1 mb-4 text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <li>Date and time of the request</li>
                    <li>Page from which the file was requested</li>
                    <li>Access status (file transferred, file not found, etc.)</li>
                    <li>Web browser and operating system used</li>
                    <li>Complete IP address of the requesting computer</li>
                    <li>Transferred data volume</li>
                </ul>
                <p>
                    These data will not be merged with other data sources. Processing takes place in accordance with Art. 6 Para. 1 (f) EU GDPR on the basis of our legitimate interest in improving the stability and functionality of our website.
                </p>
                <p>
                    For reasons of technical security, in particular to prevent attempts to attack our web server, we store these data briefly. It is not possible for us to draw conclusions about individual persons on the basis of these data. After seven days at the latest, these data are made anonymous at domain level by shortening the IP address so that it is no longer possible to establish a reference to the individual user. In addition, these data are processed anonymously for statistical purposes; these are not compared with other data or passed on to third parties, even in extracts.
                </p>
            </Subsection>

            <Subsection title="(2) Utilization of Personal Data">
                <p>
                    Personal Data offered by you will be utilized by us within the scope of the stated purpose of the utilization with which you have agreed. If we want to utilize your Personal Data beyond this scope, we will give prior notice to you of the purpose and scope of the proposed utilization, and by doing so will be deemed to have obtained your consent.
                </p>
            </Subsection>

            <Subsection title="(3) Utilization of Cookie">
                <p>
                    When you visit our website, we may store information on your computer in the form of cookies. Cookies are small files that are transferred from an Internet server to your browser and stored on its hard drive. Only the Internet protocol address is stored here - no personal data. This information, which is stored in the cookies, allows you to be automatically recognized the next time you visit our website, which makes it easier for you to use. The legal basis for the use of cookies is the legitimate interest pursuant to Art. 6 Para. 1 (f) EU GDPR.
                </p>
                <p>
                    Of course you can also visit our website without accepting cookies. If you do not want your computer to be recognized during your next visit, you can also refuse the use of cookies by changing the settings in your browser to &quot;refuse cookies&quot;. The respective procedure can be found in the operating instructions of your browser. If you reject the use of cookies, however, there may be restrictions in the use of some areas of our website.
                </p>
            </Subsection>

            <Subsection title="(4) Utilization of Google Tag Manager">
                <p>
                    This website uses Google Tag Manager. The Tag Manager does not collect personally identifiable information. The tool triggers other tags that may themselves collect information. Google Tag Manager does not access this information. If deactivation has been made at the domain or cookie level, it will persist for all tracking tags implemented with Google Tag Manager. Google&apos;s privacy policy for this tool can be found here:
                </p>
                <div className="mt-2">
                    <a href="https://www.google.com/analytics/terms/tag-manager/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline font-medium break-all">
                        https://www.google.com/analytics/terms/tag-manager/ <ExternalLink size={14} className="ml-2 shrink-0" />
                    </a>
                </div>
            </Subsection>

            <Subsection title="(5) Utilization of Google Analytics">
                <div className="space-y-4">
                    <p>We use Google Analytics, a web analysis service provided by Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043 USA, hereinafter referred to as &quot;Google&quot;, on our website. Google Analytics uses &quot;cookies&quot;, which are text files placed on your computer, to help the website analyze how users use the site.</p>
                    <p>The information generated by these cookies, such as the time, place and frequency of your website visit including your IP address, is transmitted to Google in the USA and stored there.</p>
                    <p>We use Google Analytics with the addition &quot;_gat._anonymizeIp&quot; on our website. In this case, your IP address will already be shortened by Google within member states of the European Union or in other contracting states of the Agreement on the European Economic Area and thus made anonymous.</p>
                    <p>Google will use this information for the purpose of evaluating your use of our website, compiling reports on website activity for us and providing other services relating to website activity and internet usage. Google may also transfer this information to third parties where required to do so by law, or where such third parties process the information on behalf of Google.</p>
                    <p>According to its own specifications, Google will not associate your IP address with any other data held by Google. You may refuse the use of cookies by selecting the appropriate settings on your browser, however please note that if you do this you may not be able to use the full function of our website.</p>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <p>
                            In addition, Google offers a deactivation add-on for the most common browsers, which gives you more control over which data Google collects about the websites you visit. The add-on tells Google Analytics&apos; JavaScript (ga.js) that no website visit information should be transmitted to Google Analytics. However, the deactivation add-on for browsers of Google Analytics does not prevent information from being transmitted to us or to other web analysis services we may use. For further information on installing the Browser Add-on, please click on the following link:
                        </p>
                        <a href="https://tools.google.com/dlpage/gaoptout?hl=en-GB" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline mt-2 font-medium break-all">
                            https://tools.google.com/dlpage/gaoptout?hl=en-GB <ExternalLink size={14} className="ml-1" />
                        </a>
                    </div>
                    <p>
                        If you visit our site via a mobile device (smartphone or tablet), you must <span className="text-blue-600 font-bold underline cursor-pointer">click this link (Opt-out)</span> instead to prevent Google Analytics from tracking you within this site in the future. This is also possible as an alternative to the browser add-on above. Clicking the link will set an opt-out cookie in your browser that is only valid for that browser and that domain.
                    </p>
                    <p>If you have consented to your web and app browsing history being linked to your Google Account by Google and information from your Google Account being used to personalize advertisements, Google will use your information in conjunction with Google Analytics data to create cross-device remarketing audience lists. Google Analytics first collects on our website your Google-authenticated ID, which is associated with your Google Account (i.e., personal information). Google Analytics will then temporarily associate your ID with your Google Analytics data in order to optimize our target audiences.</p>
                    <p>If you don&apos;t agree, you can turn it off by making the appropriate settings in the My Account section of your Google Account.</p>
                </div>
            </Subsection>

            <Subsection title="(6) Utilization of SPIRAL">
                <p>We use the SPIRAL online database service provided by PIPED BITS Co., Ltd. as an entry form which we use to make personal information available from you.</p>
                <p>The information and privacy policy of PIPED BITS Co., Ltd. relating to this tool can be found here:</p>
                
                <div className="grid gap-3 mt-4">
                    {[
                        { label: "Privacy policy", url: "https://www.pi-pe.co.jp/company/management/privacy/" },
                        { label: "Management system", url: "https://www.pi-pe.co.jp/company/managementsystem/" },
                        { label: "Data security", url: "https://www.pi-pe.co.jp/spiral-series/spiral-suite/security/" }
                    ].map(link => (
                        <div key={link.label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 p-3 bg-slate-50 rounded border border-slate-100">
                            <span className="font-bold text-slate-700 w-40">{link.label}</span>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline break-all text-sm">
                                {link.url} <ExternalLink size={14} className="ml-2 shrink-0" />
                            </a>
                        </div>
                    ))}
                </div>
            </Subsection>

            <Subsection title="(7) Safety Measures Protecting Personal Data">
                <p>We have taken technical and administrative security precautions to protect your personal data against loss, destruction, manipulation and unauthorized access. All our employees as well as service providers working for us are obliged to comply with the applicable data protection laws.</p>
                <p>Whenever we collect and process personal data, it is encrypted before it is transmitted. This means that your data cannot be misused by third parties. Our security precautions are subject to a continuous improvement process and our data protection declarations are constantly revised. Please make sure that you have the latest version.</p>
            </Subsection>

            <Subsection title="(8) Observance of Laws, Ordinances and Other Rules">
                <p>In regard to the Personal Data provided by you through this web site, we will comply with the relevant laws and ordinances, as well as other rules that are applicable in Japan. We will, as appropriate, modify its approach to the protection of Personal Data as changes to the relevant laws, ordinances, and social norms occur.</p>
            </Subsection>

            <Subsection title="(9) Your rights">
                <p className="mb-6">You have the right at any time to information, correction, deletion or restriction of the processing of your stored data, a right of objection to the processing as well as a right to data transfer and a right of complaint in accordance with the requirements of data protection law.</p>
                
                <div className="grid gap-4">
                    <RightItem label="Right to information:">
                        <p>You can request information from us as to whether and to what extent we process your data.</p>
                    </RightItem>
                    
                    <RightItem label="Right to correction:">
                        <p>If we process your data that is incomplete or incorrect, you can demand that we correct or complete it at any time.</p>
                    </RightItem>
                    
                    <RightItem label="Right to deletion:">
                        <p>You can demand that we delete your data if we process it unlawfully or if the processing disproportionately interferes with your legitimate protection interests. Please note that there may be reasons that prevent an immediate deletion, e.g. in the case of legally regulated storage obligations. Irrespective of the exercise of your right to deletion, we will delete your data immediately and completely, insofar as there is no legal or statutory obligation to retain data in this respect.</p>
                    </RightItem>
                    
                    <RightItem label="Right to limit the processing:">
                        <p>You can ask us to restrict the processing of your data if:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 marker:text-blue-500">
                            <li>you dispute the accuracy of the data for a period of time that allows us to verify the accuracy of the data.</li>
                            <li>the processing of the data is unlawful, but you refuse to delete it and instead demand a restriction on the use of the data,</li>
                            <li>we no longer need the data for the intended purpose, but you still need this data to assert or defend legal claims, or</li>
                            <li>you have objected to the processing of the data.</li>
                        </ul>
                    </RightItem>
                    
                    <RightItem label="Right to data transferability:">
                        <p>You may request that we provide you with the information you have provided to us in a structured, common and machine-readable format and that you may provide that information to another responsible person without our interference, provided that:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 marker:text-blue-500">
                            <li>we process this data on the basis of an agreement given and revocable by you or for the fulfilment of a contract between us, and</li>
                            <li>this processing is carried out using automated procedures.</li>
                        </ul>
                        <p className="mt-3 text-sm italic bg-slate-50 p-2 rounded">If technically feasible, you may request us to transfer your data directly to another responsible party.</p>
                    </RightItem>
                </div>

                <div className="mt-8 p-5 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-slate-800 font-medium">
                        If you wish to assert any of the above rights against us, please contact us. In case of doubt, we can request additional information to confirm your identity.
                    </p>
                </div>
            </Subsection>

            <Subsection title="(10) Personal data of the linked pages">
                <p>Our website is linked to various other websites which refer to the cooperation with the customer service organisations of the company, the providers and others. However, we hereby declare that we are not responsible for the processing of personal data by such websites maintained by third parties, including the associated websites.</p>
            </Subsection>

            <Subsection title="(11) Changes to this Privacy Policy">
                <p>We reserve the right to change our privacy policy if necessary due to new technologies. Please make sure that you have the most updated version. If any essential changes are made to this privacy policy, we will notify those changes on our website.</p>
            </Subsection>

          </Section>

        </main>
      </div>
    </div>
  );
}