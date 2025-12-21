'use client';

import { useState, useEffect, useRef } from 'react';
// 1. IMPORT THE FONTS
import { Manrope, Inter, JetBrains_Mono } from 'next/font/google';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import { ChevronRight, Zap, ShieldCheck, Globe, ArrowRight, Factory, Landmark, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

// 2. CONFIGURE FONTS
// Manrope: For strong, engineered headings
const manrope = Manrope({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
});

// Inter: For clean, legible body text
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-body',
});

// JetBrains Mono: For technical data, specs, and labels
const jetbrains = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
});

// --- Constants ---
const HERO_IMAGES = [
  '/images/hero/hero1.jpg',
  '/images/hero/hero2.jpg',
  '/images/hero/hero3.jpg',
  '/images/hero/hero4.jpg',
  '/images/hero/hero5.jpg',
];

const PRODUCTS = [
  {
    id: 1,
    name: "Generator Transformer",
    letter: "01",
    description: "High-efficiency transformers designed to withstand extreme thermal and mechanical stresses in power generation plants."
  },
  {
    id: 2,
    name: "Power Transformer",
    letter: "02",
    description: "Reliable transmission solutions ensuring stable voltage regulation and minimal energy loss across long distances."
  },
  {
    id: 3,
    name: "Scott-Transformer",
    letter: "03",
    description: "Specialized railway transformers converting 3-phase supply to 2-phase for balanced traction loads."
  },
  {
    id: 4,
    name: "V-connected Transformer",
    letter: "04",
    description: "Compact railway traction solutions optimized for specific load requirements and efficient space utilization."
  },
  {
    id: 5,
    name: "Auto Transformer",
    letter: "05",
    description: "Crucial for railway electrification, boosting voltage at intervals to maintain constant power supply to trains."
  }
];

const AUTO_SLIDE_INTERVAL = 6000;

// --- Sub-Components ---

// 1. Professional Section Header
const SectionHeader = ({ title, subtitle, dark = false }: { title: string, subtitle: string, dark?: boolean }) => (
  <div className="mb-16 md:mb-24 max-w-4xl">
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex items-center gap-3 mb-4"
    >
      <div className={`h-[2px] w-8 ${dark ? 'bg-blue-400' : 'bg-blue-700'}`} />
      {/* MONO FONT for labels */}
      <span className={`font-mono text-xs font-bold tracking-[0.2em] uppercase ${dark ? 'text-blue-200' : 'text-blue-800'}`}>
        {subtitle}
      </span>
    </motion.div>
    {/* DISPLAY FONT for headings */}
    <motion.h2 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className={`font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] ${dark ? 'text-white' : 'text-slate-900'}`}
    >
      {title}
    </motion.h2>
  </div>
);

// 2. Technical Scroll Section
function ProductScrollSection() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    return smoothProgress.on("change", (latest) => {
      setActiveIndex(Math.min(Math.floor(latest * PRODUCTS.length), PRODUCTS.length - 1));
    });
  }, [smoothProgress]);

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-[#0b1120]">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        {/* Abstract Technical Background */}
        <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-900/10 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 h-full flex flex-col justify-center">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 h-[80vh] items-center">
                {/* Left: List Navigation */}
                <div className="lg:col-span-4 flex flex-col justify-center border-l border-white/10 pl-8 md:pl-12 space-y-8">
                    {PRODUCTS.map((prod, idx) => ( 
                    <button
                        key={prod.id}
                        onClick={() => {
                            if (targetRef.current) {
                                const scrollHeight = targetRef.current.scrollHeight;
                                const sectionHeight = scrollHeight / PRODUCTS.length;
                                window.scrollTo({ top: targetRef.current.offsetTop + (sectionHeight * idx), behavior: 'smooth' });
                            }
                        }}
                        className={`group text-left transition-all duration-500 ${idx === activeIndex ? 'opacity-100' : 'opacity-30 hover:opacity-60'}`}
                      >
                        <div className="flex items-baseline gap-4 mb-2">
                          <span className={`font-mono text-xs font-bold tracking-widest ${idx === activeIndex ? 'text-blue-400' : 'text-white'}`}>
                            {prod.letter}
                          </span>
                          <h3 className="font-display text-xl md:text-2xl font-bold text-white tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                            {prod.name}
                          </h3>
                        </div>
                        <div className={`h-[1px] bg-blue-500 transition-all duration-500 ${idx === activeIndex ? 'w-full max-w-[200px]' : 'w-0'}`} />
                      </button>
                    ))}
                </div>

                {/* Right: Active Content */}
                <div className="hidden lg:flex lg:col-span-8 items-center justify-center relative pl-12">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="relative w-full max-w-2xl"
                        >
                            {/* Decorative Technical Number */}
                            <div className="absolute -top-24 -left-12 text-[12rem] font-bold text-white/[0.02] select-none font-mono tracking-tighter">
                                {PRODUCTS[activeIndex].letter}
                            </div>

                            <div className="space-y-8 relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 border border-blue-500/30 bg-blue-500/10 rounded-full text-blue-400 text-xs font-mono font-bold uppercase tracking-widest">
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                                    Specification
                                </div>
                                
                                <h2 className="font-display text-5xl font-bold text-white tracking-tight leading-tight">
                                    {PRODUCTS[activeIndex].name}
                                </h2>
                                
                                <p className="font-sans text-xl text-slate-400 leading-relaxed font-light max-w-xl border-l-2 border-white/10 pl-6">
                                    {PRODUCTS[activeIndex].description}
                                </p>

                                <div className="pt-4">
                                    <Link href="/products" className="inline-flex items-center gap-3 text-white font-medium group hover:text-blue-400 transition-colors">
                                        <span className="font-mono text-sm uppercase tracking-wider border-b border-white/30 pb-1 group-hover:border-blue-400 transition-all">View Datasheet</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}

// 3. Hero Section
function HeroSection() {
    const [index, setIndex] = useState(0);
    
    useEffect(() => {
        const timer = setInterval(() => setIndex(i => (i + 1) % HERO_IMAGES.length), AUTO_SLIDE_INTERVAL);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-screen w-full bg-slate-900 overflow-hidden">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2 }}
                        className="absolute inset-0"
                    >
                        <img 
                            src={HERO_IMAGES[index]} 
                            alt="Industrial Engineering" 
                            className="w-full h-full object-cover opacity-60" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]" />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 container mx-auto px-6 md:px-12 h-full flex flex-col justify-center">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="max-w-5xl"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <span className="h-[1px] w-12 bg-blue-500" />
                        {/* MONO for dates/labels */}
                        <span className="font-mono text-sm font-bold tracking-[0.2em] text-blue-400 uppercase">
                            Since 1897
                        </span>
                    </div>

                    <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[1.05] mb-8">
                        Engineering <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                            The Future Grid.
                        </span>
                    </h1>

                    <p className="font-sans text-lg md:text-2xl text-slate-300 font-light leading-relaxed max-w-2xl mb-12">
                        Meiden T&D India delivers world-class power infrastructure solutions, combining Japanese precision with global manufacturing excellence.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6">
                        <Link href="/products">
                            <button className="px-10 py-5 bg-blue-700 text-white text-xs font-mono font-bold tracking-[0.2em] uppercase hover:bg-blue-600 transition-colors w-full sm:w-auto shadow-2xl shadow-blue-900/50">
                                View Solutions
                            </button>
                        </Link>
                        <Link href="/contact-us">
                            <button className="px-10 py-5 bg-transparent border border-white/20 text-white text-xs font-mono font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-slate-900 transition-all w-full sm:w-auto backdrop-blur-sm">
                                Contact Sales
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Bar info */}
            <div className="absolute bottom-0 left-0 w-full border-t border-white/10 bg-slate-950/80 backdrop-blur-md z-20 hidden md:block">
                <div className="container mx-auto px-12 py-6 flex justify-between text-white/60 text-xs font-mono tracking-widest uppercase">
                    <span>Tokyo Stock Exchange: 6508</span>
                    <div className="flex gap-8">
                        <span>ISO 9001:2015</span>
                        <span>ISO 14001:2015</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

// 4. Features Section
function FeaturesSection() {
    const features = [
        { title: "Vacuum Interrupter Tech", desc: "Industry-leading efficiency in medium voltage switchgear applications.", icon: Zap },
        { title: "Japanese Engineering", desc: "Heritage of 125+ years ensuring uncompromising reliability and safety.", icon: ShieldCheck },
        { title: "Global Sustainability", desc: "Eco-friendly SF6-free solutions contributing to carbon neutrality.", icon: Globe },
    ];

    return (
        <section className="py-24 md:py-32 bg-white">
            <div className="container mx-auto px-6 md:px-12">
                <SectionHeader title="Core Capabilities" subtitle="Why Meiden" />
                
                <div className="grid md:grid-cols-3 gap-px bg-slate-200 border border-slate-200">
                    {features.map((f, i) => (
                        <div key={i} className="bg-white p-12 hover:bg-slate-50 transition-colors duration-300 group">
                            <div className="mb-8 p-4 bg-slate-100 w-fit rounded-sm group-hover:bg-blue-600 transition-colors duration-300">
                                <f.icon className="w-8 h-8 text-slate-700 group-hover:text-white transition-colors" strokeWidth={1.5} />
                            </div>
                            <h3 className="font-display text-xl font-bold text-slate-900 mb-4 tracking-tight">{f.title}</h3>
                            <p className="font-sans text-slate-600 leading-relaxed font-light">{f.desc}</p>
                            <div className="mt-8">
                                <ArrowUpRight className="w-6 h-6 text-slate-300 group-hover:text-blue-600 transition-colors" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// 5. Corporate Info Section
function AboutSection() {
    return (
        <section className="py-24 md:py-32 bg-slate-50 border-y border-slate-200">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    <div>
                        <SectionHeader title="Global Heritage, Local Power." subtitle="Corporate Profile" />
                        <div className="space-y-6 text-lg text-slate-600 font-sans font-light leading-relaxed">
                            <p>
                                <strong className="font-display text-slate-900 font-bold">Meiden T&D India Limited</strong> operates as a strategic subsidiary of Meidensha Corporation, Japan. 
                            </p>
                            <p>
                                By integrating Japanese technological prowess with India’s robust manufacturing ecosystem, we produce world-class Power Transformers and T&D components that power national grids and heavy industries alike.
                            </p>
                            <div className="pt-8">
                                <Link href="/about-us" className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase text-blue-700 hover:text-blue-900 border-b-2 border-blue-700 pb-1 hover:border-blue-900 transition-all">
                                    Read Corporate Story
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="bg-white p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <Landmark className="w-10 h-10 text-blue-700 mb-6" strokeWidth={1} />
                            <h4 className="font-display text-4xl font-bold text-slate-900 mb-2 tracking-tight">1897</h4>
                            <p className="font-mono text-xs text-slate-500 font-bold uppercase tracking-wider">Foundation Year</p>
                        </div>
                        <div className="bg-white p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <Globe className="w-10 h-10 text-blue-700 mb-6" strokeWidth={1} />
                            <h4 className="font-display text-4xl font-bold text-slate-900 mb-2 tracking-tight">Global</h4>
                            <p className="font-mono text-xs text-slate-500 font-bold uppercase tracking-wider">Operations Network</p>
                        </div>
                        <div className="bg-white p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow sm:col-span-2">
                            <Factory className="w-10 h-10 text-blue-700 mb-6" strokeWidth={1} />
                            <h4 className="font-display text-xl font-bold text-slate-900 mb-2 tracking-tight">Nellore Manufacturing Complex</h4>
                            <p className="font-sans text-slate-600 font-light">
                                A state-of-the-art facility capable of manufacturing transformers up to <span className="font-bold text-slate-900">500MVA / 500kV</span> class.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// 3. Inject CSS Variables into Main Layout
export default function HomePage() {
  return (
    <main 
        className={`
            ${manrope.variable} 
            ${inter.variable} 
            ${jetbrains.variable} 
            font-sans 
            min-h-screen 
            bg-white 
            selection:bg-blue-900 
            selection:text-white
        `}
    >
      <HeroSection />
      <FeaturesSection />
      <ProductScrollSection />
      <AboutSection />
    </main>
  );
}