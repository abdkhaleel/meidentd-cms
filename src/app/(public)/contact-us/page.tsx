'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MapPin, Mail, CheckCircle, X, Loader2, Upload, FileText, ArrowRight } from 'lucide-react';

// --- TERMS MODAL ---
function TermsModal({ isOpen, onClose, onAgree }: { isOpen: boolean; onClose: () => void; onAgree: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-2xl rounded shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="bg-brand-secondary px-8 py-6 border-b border-brand-primary/20">
          <h3 className="text-2xl font-bold text-white">Privacy Policy & Terms</h3>
          <p className="text-sm text-blue-200 mt-1">Please read and accept to continue.</p>
        </div>
        
        {/* Explicit text-gray-600 to override global blue */}
        <div className="p-8 overflow-y-auto leading-7 text-sm text-gray-600 space-y-6">
          <div>
            <p className="font-bold text-brand-primary text-base mb-2">Use of Your Personal Information</p>
            <p>Any personal data you fill in the Inquiry Form will be treated with utmost care in accordance with our &quot;Privacy Policy&quot;.</p>
          </div>
          
          <ul className="list-disc pl-5 space-y-2 marker:text-brand-primary">
            <li>Personal information provided shall be shared within Meiden Group and with authorized sales agents.</li>
            <li><strong>Purposes of Use:</strong>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Response to your inquiry and checking details.</li>
                <li>Dispatch of printed materials (catalogs, etc.).</li>
                <li>Announcements of products, technical info, and events.</li>
              </ol>
            </li>
            <li>Please note that in some cases a reply may not be available or it takes time to respond.</li>
          </ul>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-2.5 text-gray-500 font-bold hover:text-gray-800 transition-colors">
            Decline
          </button>
          <button onClick={onAgree} className="px-8 py-2.5 bg-brand-primary text-white font-bold rounded shadow-lg hover:bg-brand-deep hover:shadow-xl transition-all">
            I Agree & Proceed
          </button>
        </div>
      </motion.div>
    </div>
  );
}
 
// --- FORM MODAL ---
function ContactFormModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/contact-us', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3500);  

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="bg-white w-full max-w-5xl rounded shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
      >
         
        {/* LEFT SIDE: Info Panel */}
        <div className="hidden md:flex w-1/3 bg-brand-secondary p-10 flex-col justify-between relative overflow-hidden">
          {/* Decorative Circle */}
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-white mb-4">Get in Touch</h3>
            <p className="text-blue-100 leading-relaxed">
              Our specialized teams are ready to assist you. Please fill out the form for prompt assistance.
            </p>
          </div>

          <div className="space-y-6 relative z-10 text-white/90">
            <div className="flex items-start gap-4">
               <div className="p-2 bg-white/10 rounded"><Phone size={18} /></div>
               <div>
                 <p className="text-xs text-blue-200 uppercase font-bold tracking-wider">Call Us</p>
                 <p className="font-medium">+91-124-4549830</p>
               </div>
            </div>
            <div className="flex items-start gap-4">
               <div className="p-2 bg-white/10 rounded"><Mail size={18} /></div>
               <div>
                 <p className="text-xs text-blue-200 uppercase font-bold tracking-wider">Email Us</p>
                 <p className="font-medium">info@meidentd.com</p>
               </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10">
             <p className="text-xs text-white/50">Meiden T&D (India) Limited</p>
          </div>
        </div>
 
        {/* RIGHT SIDE: The Form */}
        <div className="w-full md:w-2/3 bg-white relative flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
             <h2 className="text-2xl font-bold text-brand-secondary">Enquiry Form</h2>
             <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
               <X size={24} />
             </button>
          </div>

          <div className="p-8 overflow-y-auto custom-scrollbar">
            {success ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-in fade-in zoom-in">
                <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <CheckCircle size={48} />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-3">Enquiry Sent!</h3>
                <p className="text-gray-500 max-w-sm mx-auto">Thank you for contacting us. Our team has received your details and will respond shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Department Selection */}
                <div className="space-y-2">
                   <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Select Department</label>
                   <div className="relative">
                      <select name="department" className="w-full p-4 bg-gray-50 border border-gray-200 rounded text-gray-800 font-bold focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none appearance-none transition-all">
                        <option value="Sales & Marketing">Sales & Marketing</option>
                        <option value="Purchase">Purchase Department</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <ArrowRight size={16} className="rotate-90" />
                      </div>
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Company Name <span className="text-red-500">*</span></label>
                    <input type="text" name="company" required className="w-full p-3 bg-white border border-gray-300 rounded text-gray-800 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Full Name <span className="text-red-500">*</span></label>
                    <input type="text" name="name" required className="w-full p-3 bg-white border border-gray-300 rounded text-gray-800 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Email Address <span className="text-red-500">*</span></label>
                    <input type="email" name="email" required className="w-full p-3 bg-white border border-gray-300 rounded text-gray-800 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Phone Number <span className="text-red-500">*</span></label>
                    <input type="tel" name="phone" required minLength={10} maxLength={10} className="w-full p-3 bg-white border border-gray-300 rounded text-gray-800 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Message <span className="text-red-500">*</span></label>
                  <textarea name="message" required rows={4} className="w-full p-3 bg-white border border-gray-300 rounded text-gray-800 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all resize-none"></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Attach File (Optional)</label>
                  <div className="relative border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg p-6 text-center cursor-pointer hover:bg-blue-50 hover:border-brand-primary transition-colors group">
                    <input 
                      type="file" 
                      name="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                      onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
                    />
                    <div className="flex flex-col items-center justify-center text-gray-500 group-hover:text-brand-primary transition-colors">
                      <Upload size={24} className="mb-2 opacity-50 group-hover:opacity-100" />
                      <span className="text-sm font-medium">{fileName || "Drag & drop or click to upload"}</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded flex items-start gap-3 text-red-700 text-sm">
                    <X size={16} className="mt-0.5 shrink-0" />
                    {error}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-brand-primary text-white font-bold py-4 rounded shadow-lg hover:bg-brand-deep hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Submit Enquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
 
// --- MAIN PAGE ---
export default function ContactPage() {
  const [showTnc, setShowTnc] = useState(false);
  const [showForm, setShowForm] = useState(false);
 
  const handleOpenEnquiry = () => {
    setShowTnc(true);
  };
 
  const handleAgreeTnc = () => {
    setShowTnc(false);
    setTimeout(() => setShowForm(true), 200);  
  };

  return (
    <div className="min-h-screen bg-gray-50">
       
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[50vh] min-h-[400px] bg-brand-secondary flex items-center justify-center overflow-hidden">
        {/* Abstract Backgrounds */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary via-[#0a2558] to-black opacity-90"></div>
        
        {/* Animated Text */}
        <div className="relative z-10 text-center text-white px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
             <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-white">
               Contact Us
             </h1>
             <div className="h-1 w-24 bg-brand-bright mx-auto mb-6 rounded-full"></div>
             <p className="text-xl text-blue-100 max-w-2xl mx-auto font-light leading-relaxed">
               We are here to help. Reach out to our <strong className="text-white">Sales</strong> or <strong className="text-white">Purchase</strong> departments for prompt assistance.
             </p>
          </motion.div>
        </div>
      </section>
 
      {/* 2. MAIN CONTENT CONTAINER */}
      <section className="container max-w-6xl mx-auto px-4 py-16 -mt-24 relative z-20">
        <div className="grid md:grid-cols-3 gap-8">
            
          {/* A. CORPORATE OFFICE CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-1 bg-white p-10 rounded shadow-xl border-t-[6px] border-brand-primary flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300"
          >
            <div className="w-16 h-16 bg-blue-50 text-brand-primary rounded-full flex items-center justify-center mb-6 shadow-inner">
              <MapPin size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Corporate Office</h3>
            {/* Explicit gray text to avoid blue bleed */}
            <p className="text-gray-600 leading-relaxed text-sm">
              Building No. 10, Tower C, 1st Floor,<br/>
              DLF Cyber City, Phase - II,<br/>
              Gurgaon-122002, Haryana, India
            </p>
          </motion.div>
 
          {/* B. ENQUIRY ACTION CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 bg-brand-secondary rounded shadow-xl relative overflow-hidden flex flex-col md:flex-row"
          > 
            {/* Decorative Blobs */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="p-10 flex-1 relative z-10 flex flex-col justify-center">
              <h3 className="text-3xl font-bold text-white mb-4">Have an Enquiry?</h3>
              <p className="text-blue-100 mb-8 leading-relaxed">
                 Whether you are looking for product solutions (Sales) or looking to supply to us (Purchase), we want to hear from you.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-white">
                  <div className="p-2 bg-white/10 rounded-full"><Phone size={18} /></div>
                  <span className="font-bold text-lg tracking-wide">91-124-4549830</span>
                </div>
                <div className="flex items-center gap-4 text-white">
                   <div className="p-2 bg-white/10 rounded-full"><Mail size={18} /></div>
                   <span className="text-lg">info@meidentd.com</span>
                </div>
              </div>
            </div>
 
            {/* Right Side / Bottom: Button Area */}
            <div className="bg-brand-deep/50 p-10 md:w-64 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-white/10">
              <button 
                onClick={handleOpenEnquiry}
                className="group w-full bg-white text-brand-secondary px-6 py-4 rounded font-bold shadow-lg hover:bg-brand-bright hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
              >
                Start Enquiry
                <FileText size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-center text-xs text-blue-300/70 mt-4 px-4">
                *By clicking, you agree to our Privacy Policy
              </p>
            </div>
          </motion.div>

        </div>
      </section>
 
      {/* 3. MODALS */}
      <AnimatePresence>
        {showTnc && (
          <TermsModal 
            isOpen={showTnc} 
            onClose={() => setShowTnc(false)} 
            onAgree={handleAgreeTnc} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && (
          <ContactFormModal 
            isOpen={showForm} 
            onClose={() => setShowForm(false)} 
          />
        )}
      </AnimatePresence>

    </div>
  );
}