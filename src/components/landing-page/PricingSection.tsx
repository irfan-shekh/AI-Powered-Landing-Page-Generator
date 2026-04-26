import React from 'react';
import { CheckCircle } from 'lucide-react';

interface PricingPlan {
  plan: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

interface PricingProps {
  pricing: PricingPlan[];
  brand: {
    colorTheme: 'amber' | 'indigo' | 'rose' | 'emerald' | 'slate';
    variant: 'dark' | 'light' | 'glassmorphism';
    borderRadius: 'none' | 'md' | 'full';
  };
}

export function PricingSection({ pricing, brand }: PricingProps) {
  if (!pricing || pricing.length === 0) return null;

  const colorThemeMap = {
    amber: { text: 'text-amber-500', bg: 'bg-amber-600 hover:bg-amber-700', ring: 'ring-amber-500/50', icon: 'text-amber-500' },
    indigo: { text: 'text-indigo-500', bg: 'bg-indigo-600 hover:bg-indigo-700', ring: 'ring-indigo-500/50', icon: 'text-indigo-500' },
    rose: { text: 'text-rose-500', bg: 'bg-rose-600 hover:bg-rose-700', ring: 'ring-rose-500/50', icon: 'text-rose-500' },
    emerald: { text: 'text-emerald-500', bg: 'bg-emerald-600 hover:bg-emerald-700', ring: 'ring-emerald-500/50', icon: 'text-emerald-500' },
    slate: { text: 'text-slate-400', bg: 'bg-slate-800 hover:bg-slate-900', ring: 'ring-slate-500/50', icon: 'text-slate-400' },
  };

  const radiusMap = {
    none: 'rounded-none',
    md: 'rounded-3xl',
    full: 'rounded-[3rem]',
  };

  const isDark = brand?.variant === 'dark' || brand?.variant === 'glassmorphism';
  const isGlass = brand?.variant === 'glassmorphism';
  const theme = colorThemeMap[brand?.colorTheme as keyof typeof colorThemeMap] || colorThemeMap.indigo;

  const bgMap = {
    amber: isDark ? 'bg-[#0a0a0f]' : 'bg-amber-50/30',
    indigo: isDark ? 'bg-[#0a0a0f]' : 'bg-indigo-50/30',
    rose: isDark ? 'bg-[#0a0a0f]' : 'bg-rose-50/30',
    emerald: isDark ? 'bg-[#0a0a0f]' : 'bg-emerald-50/30',
    slate: isDark ? 'bg-[#0a0a0f]' : 'bg-slate-50/50',
  };

  return (
    <section className={`py-24 sm:py-32 ${bgMap[brand?.colorTheme as keyof typeof bgMap] || bgMap.slate}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className={`text-base font-bold leading-7 uppercase tracking-widest ${theme.text}`}>Pricing</h2>
          <p className={`mt-2 text-4xl font-extrabold tracking-tight sm:text-6xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Simple, Transparent Pricing
          </p>
        </div>
        <div className={`isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 ${pricing.length === 3 ? 'lg:max-w-7xl lg:grid-cols-3' : 'lg:max-w-5xl lg:grid-cols-2'}`}>
          {pricing.map((tier, idx) => (
            <div
              key={idx}
              className={`flex flex-col p-8 transition-all hover:scale-[1.03] duration-300 ${
                tier.isPopular 
                  ? `ring-2 ${theme.ring} scale-105 z-10 ${isDark ? 'bg-white/5' : 'bg-white shadow-2xl shadow-slate-200'}` 
                  : `ring-1 ${isDark ? 'ring-white/10 bg-white/5' : 'ring-slate-200 bg-slate-50/50'}`
              } ${radiusMap[brand?.borderRadius as keyof typeof radiusMap] || radiusMap.md} ${isGlass ? 'backdrop-blur-xl border border-white/10 ring-0' : ''}`}
            >
              <h3 className={`text-xl font-bold leading-8 ${tier.isPopular ? theme.text : isDark ? 'text-white' : 'text-slate-900'}`}>
                {tier.plan}
              </h3>
              <div className="mt-4 flex items-baseline gap-x-2">
                <span className={`text-5xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{tier.price}</span>
                <span className={`text-sm font-semibold ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>/month</span>
              </div>
              
              <button className={`mt-8 block w-full px-4 py-4 text-center text-sm font-bold leading-6 transition-all ${
                tier.isPopular 
                  ? `${theme.bg} text-white shadow-xl` 
                  : `${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-900 text-white hover:bg-slate-800'}`
              } ${radiusMap[brand?.borderRadius as keyof typeof radiusMap] || radiusMap.md}`}>
                Get Started Now
              </button>
              
              <ul className={`mt-10 space-y-4 text-sm leading-6 flex-grow ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {tier.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex gap-x-3">
                    <CheckCircle className={`h-6 w-5 flex-none ${theme.icon}`} aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
