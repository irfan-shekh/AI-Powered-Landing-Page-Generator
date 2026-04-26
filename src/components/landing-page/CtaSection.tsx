import React from 'react';

interface CtaProps {
  headline: string;
  subheadline: string;
  buttonText: string;
  brand: {
    colorTheme: 'amber' | 'indigo' | 'rose' | 'emerald' | 'slate';
    variant: 'dark' | 'light' | 'glassmorphism';
    borderRadius: 'none' | 'md' | 'full';
  };
}

export function CtaSection({ headline, subheadline, buttonText, brand }: CtaProps) {
  const bgMap = {
    amber: 'bg-amber-600',
    indigo: 'bg-indigo-600',
    rose: 'bg-rose-600',
    emerald: 'bg-emerald-600',
    slate: 'bg-slate-900',
  };

  const buttonColorMap = {
    amber: 'text-amber-600 hover:bg-amber-50',
    indigo: 'text-indigo-600 hover:bg-indigo-50',
    rose: 'text-rose-600 hover:bg-rose-50',
    emerald: 'text-emerald-600 hover:bg-emerald-50',
    slate: 'text-slate-900 hover:bg-slate-100',
  };

  const radiusMap = {
    none: 'rounded-none',
    md: 'rounded-xl',
    full: 'rounded-full',
  };

  const isDark = brand?.variant === 'dark' || brand?.variant === 'glassmorphism';
  const isGlass = brand?.variant === 'glassmorphism';
  const themeColor = brand?.colorTheme as keyof typeof bgMap || 'indigo';

  const sectionBgMap = {
    amber: 'bg-amber-600',
    indigo: 'bg-indigo-600',
    rose: 'bg-rose-600',
    emerald: 'bg-emerald-600',
    slate: 'bg-slate-900',
  };

  return (
    <section className={`relative overflow-hidden py-24 sm:py-32 ${isGlass ? 'bg-[#0a0a0f]' : (sectionBgMap[themeColor] || sectionBgMap.indigo)}`}>
      {/* Decorative Glows for Glassmorphism */}
      {isGlass && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full blur-[120px] opacity-20 bg-white"></div>
        </div>
      )}

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center z-10">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
          {headline}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-white/90">
          {subheadline}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button className={`bg-white px-10 py-4 text-lg font-bold shadow-2xl transition-all hover:scale-105 active:scale-95 ${buttonColorMap[themeColor] || buttonColorMap.indigo} ${radiusMap[brand?.borderRadius as keyof typeof radiusMap] || radiusMap.md}`}>
            {buttonText}
          </button>
        </div>
      </div>
    </section>
  );
}
