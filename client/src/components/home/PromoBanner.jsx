import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Check, Copy } from 'lucide-react';

const PromoBanner = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const promoCode = "TECH10";

  const handleCopy = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative overflow-hidden rounded-3xl border border-slate-200/40 dark:border-slate-800/80 bg-gradient-to-r from-indigo-500/10 via-violet-500/5 to-purple-500/10 dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-violet-950/20 backdrop-blur-md px-6 py-10 sm:px-12 sm:py-16 md:grid md:grid-cols-12 md:gap-8 items-center"
      >
        {/* Glow effects */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="md:col-span-7 space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 dark:bg-indigo-400/10 border border-indigo-500/35 dark:border-indigo-400/20 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <Sparkles size={14} className="animate-pulse" />
            <span>Limited Time Offer</span>
          </div>
          
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
            Upgrade Your Desk Setup & Save Big
          </h2>
          
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-light leading-relaxed max-w-lg">
            Experience high-performance computing, premium peripherals, and ergonomic layouts designed to elevate your daily productivity and gaming performance.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 items-center">
            <button
              onClick={() => navigate('/shop')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs hover:shadow-lg dark:hover:shadow-white/5 active:scale-95 transition-all"
            >
              <span>Explore Shop</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <div className="mt-8 md:mt-0 md:col-span-5 flex flex-col items-center md:items-end justify-center">
          <div className="w-full max-w-sm glass dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col items-center text-center">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">YOUR EXCLUSIVE DISCOUNT</span>
            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-purple-400 tracking-wider">
              10% OFF
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 mb-4">Applicable on all tech accessories & gear</p>
            
            {/* Promo Code Box */}
            <div className="w-full flex items-center justify-between gap-2 bg-slate-100/60 dark:bg-slate-950/60 border border-slate-250 dark:border-slate-800 rounded-xl p-2.5 pl-4">
              <code className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-widest">{promoCode}</code>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase transition-all ${
                  copied 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check size={11} />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={11} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PromoBanner;
