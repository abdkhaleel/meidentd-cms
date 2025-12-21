'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { ChevronRight, Zap, ShieldCheck, Globe, ArrowRight, Factory, Landmark } from 'lucide-react';
import Link from 'next/link';

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
    letter: "G",
    description: "High-efficiency transformers designed to withstand extreme thermal and mechanical stresses in power generation plants."
  },
  {
    id: 2,
    name: "Power Transformer",
    letter: "P",
    description: "Reliable transmission solutions ensuring stable voltage regulation and minimal energy loss across long distances."
  },
  {
    id: 3,
    name: "Scott-Transformer (Railway)",
    letter: "S",
    description: "Specialized railway transformers converting 3-phase supply to 2-phase for balanced traction loads."
  },
  {
    id: 4,
    name: "V-connected Transformer",
    letter: "V",
    description: "Compact railway traction solutions optimized for specific load requirements and efficient space utilization."
  },
  {
    id: 5,
    name: "Auto Transformer (Railway)",
    letter: "A",
    description: "Crucial for railway electrification, boosting voltage at intervals to maintain constant power supply to trains."
  }
];

const AUTO_SLIDE_INTERVAL = 5000;

function ProductScrollSection() {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      const length = PRODUCTS.length;
      const step = 1 / length;
      const index = Math.min(Math.floor(latest / step), length - 1);
      setActiveIndex(index);
    });
    return () => unsubscribe();
  }, [smoothProgress]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-slate-900">
      <div className="sticky top-[70px] h-[calc(100vh-70px)] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-80"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 w-full h-full flex flex-col md:flex-row items-center">
          <div className="hidden md:flex w-full md:w-1/3 lg:w-1/4 flex-col items-center md:items-start justify-center h-full pl-0 md:pl-10">
            <div className="relative">
              <div className="absolute left-[19px] top-4 bottom-4 w-1 bg-gray-700 -z-10 rounded-full h-82"></div>

              <div className="space-y-8 py-4">
                {PRODUCTS.map((prod, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <motion.div
                      key={prod.id}
                      className="flex items-center gap-4 group cursor-pointer"
                      animate={{ opacity: isActive ? 1 : 0.5, scale: isActive ? 1.1 : 1 }}
                    >
                      <div
                        className={`
                             w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-colors duration-300 relative
                             ${isActive
                            ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.6)]'
                            : 'bg-slate-800 border-gray-600 text-gray-400 group-hover:border-gray-400'
                          }
                           `}
                      >
                        {prod.letter}

                        {isActive && (
                          <motion.div
                            layoutId="pulse"
                            className="absolute inset-0 rounded-full border-2 border-blue-400 hidden md:block"
                            initial={{ scale: 1, opacity: 1 }}
                            animate={{ scale: 1.6, opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          />
                        )}
                      </div>

                      <span className={`hidden md:block font-medium text-sm transition-colors ${isActive ? 'text-white' : 'text-gray-500'}`}>
                        {prod.name}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="top-[70px] h-[calc(100vh-70px)] w-full md:w-2/3 lg:w-3/4 flex items-center justify-center p-6 md:p-12 h-[50vh] md:h-auto">
            <div className="relative w-full max-w-2xl aspect-[16/9] md:aspect-[21/9] flex items-center">
              <AnimatePresence mode='wait'>
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -50, filter: "blur(10px)" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-full"
                >
                  <div className="absolute -top-10 -left-10 text-9xl font-black text-white/5 select-none pointer-events-none z-0">
                    {PRODUCTS[activeIndex].letter}
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-2">
                      Product &amp; Solution 0{activeIndex + 1}
                    </h3>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                      {PRODUCTS[activeIndex].name}
                    </h2>
                    <p className="text-lg text-gray-300 leading-relaxed border-l-4 border-blue-500 pl-6 mb-8">
                      {PRODUCTS[activeIndex].description}
                    </p>

                    <div className="pl-6">
                      <Link href="/products">
                        <button className="px-6 py-2 bg-transparent border border-blue-500 text-blue-400 font-bold text-sm rounded hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2 group">
                          DETAILS
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
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

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <section className="relative w-full h-[50vh] md:h-[60vh] min-h-[450px] bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={HERO_IMAGES[currentImageIndex]}
                alt={`Hero Banner ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {HERO_IMAGES.map((_, index) => (
            <motion.button
              key={index}
              className={`h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-white w-8' : 'bg-white/40 w-2'
                }`}
              disabled
            />
          ))}
        </div>

        <motion.div
          initial={{ x: '-120%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 40, damping: 25, delay: 0.3 }}
          className="absolute top-0 left-0 h-[115%] w-full max-w-[60%] z-10 pointer-events-none drop-shadow-2xl"
          style={{ clipPath: 'polygon(0 0, 85% 0, 100% 100%, 0% 100%)' }}
        >
          <div className="w-full h-full bg-gradient-to-r from-blue-600 to-blue-500 opacity-85 backdrop-blur-sm" />
          <div className="absolute inset-0 bg-blue-600/40" />
        </motion.div>

        <div className="absolute inset-0 flex items-center z-20 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="w-full max-w-[55%] px-6 sm:px-8 md:px-12 lg:px-16 text-white"
          >
            <div className="inline-block px-3 py-1 mb-4 border border-white/40 rounded-full text-xs font-bold uppercase tracking-widest bg-white/10 backdrop-blur-sm">
              Leading Innovation
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 md:mb-6 drop-shadow-lg">
              <span className="text-gray-100 inline-block mt-2">Meiden T&amp;D</span>
              <br />
              <span className="text-yellow-300 inline-block mt-2">India Limited</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-100 mb-6 md:mb-8 leading-relaxed font-light max-w-lg">
              Delivering advanced Transmission &amp; Distribution solutions engineered with Japanese and global reliability.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href='/products' className="group bg-white text-blue-600 px-6 sm:px-8 py-3 rounded font-bold shadow-lg hover:bg-yellow-300 transition-all duration-300 flex items-center justify-center sm:justify-start">
                Explore Solutions
                <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href='/contact-us' className="px-6 sm:px-8 py-3 rounded font-bold text-white border-2 border-white/50 hover:border-white transition-all duration-300 text-center">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="h-12 md:h-20 bg-white" />

      <section className="py-12 md:py-16 lg:py-20 bg-white z-10 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3">World-Class Power Infrastructure</h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Combining Meidensha&apos;s century-long legacy with Indian manufacturing excellence.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-t-4 border-blue-600 shadow-md hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <Zap size={24} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Advanced Technology</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Cutting-edge vacuum interrupter technology designed for efficiency.</p>
            </div>
            <div className="p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-t-4 border-blue-600 shadow-md hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Japanese Reliability</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Engineered to strict quality standards for diverse conditions.</p>
            </div>
            <div className="p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-t-4 border-blue-600 shadow-md hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <Globe size={24} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Sustainable Future</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Contributing to a greener tomorrow with eco-friendly solutions.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                Who We Are
              </div>

              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Global Heritage, <br />
                <span className="text-blue-600">Local Excellence.</span>
              </h2>

              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Meiden T&D India Limited is a <span className="font-bold text-slate-900">wholly owned subsidiary</span> of Meidensha Corporation, Japan. We bridge a century of Japanese engineering precision with India's manufacturing prowess.
              </p>

              <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                <div className="h-px w-12 bg-blue-600"></div>
                <span>Established Trust & Reliability</span>
              </div>

              <div className="mt-8">
                <Link href="/about-us">
                  <button className="group flex items-center gap-2 text-slate-900 font-bold hover:text-blue-600 transition-colors">
                    Read our full story
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </motion.div>

            <div className="grid gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                whileHover={{ y: -5, borderColor: '#2563eb' }}
                className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-lg transition-all cursor-default group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-100 text-slate-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Landmark size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Meidensha Corporation</h3>
                    <p className="text-slate-600 text-sm">
                      Founded in <span className="font-bold text-blue-600">1897</span>. A global leader listed on the Tokyo & Nagoya stock exchanges, pioneering electrical infrastructure for over 125 years.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                whileHover={{ y: -5, borderColor: '#2563eb' }}
                className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-lg transition-all cursor-default group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-100 text-slate-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Factory size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Nellore Manufacturing Hub</h3>
                    <p className="text-slate-600 text-sm">
                      Situated in Andhra Pradesh, our facility is a marvel of modern engineering, capable of manufacturing Power Transformers up to <span className="font-bold text-blue-600">500MVA, 500kV</span>.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <ProductScrollSection />
    </div>
  );
}