"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  brand: {
    name: string;
    tagline: string;
    colorTheme: 'amber' | 'indigo' | 'rose' | 'emerald' | 'slate';
    variant: 'dark' | 'light' | 'glassmorphism';
    borderRadius: 'none' | 'md' | 'full';
  };
}

export function HeroSection({ headline, subheadline, ctaText, brand }: HeroProps) {
  const colorMap = {
    amber: 'bg-amber-600 hover:bg-amber-700 text-white',
    indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    rose: 'bg-rose-600 hover:bg-rose-700 text-white',
    emerald: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    slate: 'bg-slate-800 hover:bg-slate-900 text-white',
  };

  const glowMap = {
    amber: 'bg-amber-500',
    indigo: 'bg-indigo-600',
    rose: 'bg-rose-500',
    emerald: 'bg-emerald-500',
    slate: 'bg-slate-500',
  };

  const radiusMap = {
    none: 'rounded-none',
    md: 'rounded-2xl',
    full: 'rounded-full',
  };

  const isDark = brand?.variant === 'dark' || brand?.variant === 'glassmorphism';
  const isGlass = brand?.variant === 'glassmorphism';
  const themeColor = brand?.colorTheme as keyof typeof colorMap || 'indigo';

  const sectionBgMap = {
    amber: isDark ? 'bg-[#0a0a0f]' : 'bg-amber-50/50',
    indigo: isDark ? 'bg-[#0a0a0f]' : 'bg-indigo-50/50',
    rose: isDark ? 'bg-[#0a0a0f]' : 'bg-rose-50/50',
    emerald: isDark ? 'bg-[#0a0a0f]' : 'bg-emerald-50/50',
    slate: isDark ? 'bg-[#0a0a0f]' : 'bg-slate-50',
  };

  return (
    <section className={`relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40 text-center ${sectionBgMap[themeColor] || sectionBgMap.slate} ${isDark ? 'text-white' : 'text-slate-900'}`}>
      {/* Texture & Glow Effects */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

      {/* Static Premium Glows */}
      <div className={`absolute top-0 right-0 -mr-40 -mt-40 h-[600px] w-[600px] rounded-full blur-[120px] opacity-30 ${glowMap[themeColor] || glowMap.indigo}`}></div>
      <div className={`absolute bottom-0 left-0 -ml-40 -mb-40 h-[600px] w-[600px] rounded-full blur-[120px] opacity-20 ${glowMap[themeColor] || glowMap.indigo}`}></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl"
        >
          {/* Brand Badge */}
          <div className="mb-8 flex justify-center">
            <span className={`px-4 py-1.5 text-sm font-medium tracking-wide uppercase ${isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black'} ${radiusMap[brand?.borderRadius as keyof typeof radiusMap] || radiusMap.full} backdrop-blur-md`}>
              {brand?.name || 'Startup'}
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl">
            {headline}
          </h1>
          <p className={`mt-6 text-xl lg:text-2xl ${isDark ? 'text-slate-300' : 'text-slate-600'} opacity-90 leading-relaxed`}>
            {subheadline}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button className={`px-10 py-4 text-lg font-bold shadow-2xl transition-all hover:scale-105 active:scale-95 ${colorMap[themeColor] || colorMap.indigo} ${radiusMap[brand?.borderRadius as keyof typeof radiusMap] || radiusMap.full}`}>
              {ctaText}
            </button>
            <button className={`px-10 py-4 text-lg font-bold transition-all backdrop-blur-xl border ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-black/5 border-black/10 hover:bg-black/10 text-black'} ${radiusMap[brand?.borderRadius as keyof typeof radiusMap] || radiusMap.full}`}>
              Live Demo
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}