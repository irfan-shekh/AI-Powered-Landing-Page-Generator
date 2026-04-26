"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ProblemProps {
  headline: string;
  description: string;
  brand: {
    colorTheme: 'amber' | 'indigo' | 'rose' | 'emerald' | 'slate';
    variant: 'dark' | 'light' | 'glassmorphism';
    borderRadius: 'none' | 'md' | 'full';
  };
}

export function ProblemSection({ headline, description, brand }: ProblemProps) {
  const isDark = brand?.variant === 'dark' || brand?.variant === 'glassmorphism';
  const isGlass = brand?.variant === 'glassmorphism';
  const themeColor = brand?.colorTheme as keyof typeof textColorMap || 'indigo';
  
  const sectionBgMap = {
    amber: isDark ? 'bg-[#0a0a0f]' : 'bg-amber-50/20',
    indigo: isDark ? 'bg-[#0a0a0f]' : 'bg-indigo-50/20',
    rose: isDark ? 'bg-[#0a0a0f]' : 'bg-rose-50/20',
    emerald: isDark ? 'bg-[#0a0a0f]' : 'bg-emerald-50/20',
    slate: isDark ? 'bg-[#0a0a0f]' : 'bg-slate-50',
  };

  const textColorMap = {
    amber: 'text-amber-500',
    indigo: 'text-indigo-500',
    rose: 'text-rose-500',
    emerald: 'text-emerald-500',
    slate: 'text-slate-400',
  };

  const radiusMap = {
    none: 'rounded-none',
    md: 'rounded-3xl',
    full: 'rounded-[3rem]',
  };

  return (
    <section className={`py-24 sm:py-32 ${sectionBgMap[themeColor] || sectionBgMap.slate}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`mx-auto max-w-4xl p-12 text-center ${
            isGlass 
              ? 'bg-white/5 backdrop-blur-2xl border border-white/10' 
              : isDark 
                ? 'bg-slate-900 border border-slate-800' 
                : 'bg-white shadow-2xl shadow-slate-200'
          } ${radiusMap[brand?.borderRadius as keyof typeof radiusMap] || radiusMap.md}`}
        >
          <h2 className={`text-base font-bold uppercase tracking-widest ${textColorMap[themeColor] || textColorMap.indigo}`}>
            The Problem
          </h2>
          <h3 className={`mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {headline}
          </h3>
          <p className={`mt-6 text-xl leading-8 ${isDark ? 'text-slate-400' : 'text-slate-600'} max-w-2xl mx-auto`}>
            {description}
          </p>
          
          <div className="mt-10 flex justify-center gap-4 opacity-50 grayscale">
             {/* Subtle indicator of current status-quo pain points */}
             <div className="flex flex-col items-center gap-2">
                <div className="h-1 w-12 bg-current rounded-full"></div>
                <div className="h-1 w-8 bg-current rounded-full"></div>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
