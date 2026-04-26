import React from 'react';

interface Testimonial {
  name: string;
  role: string;
  content: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
  brand: {
    colorTheme: 'amber' | 'indigo' | 'rose' | 'emerald' | 'slate';
    variant: 'dark' | 'light' | 'glassmorphism';
    borderRadius: 'none' | 'md' | 'full';
  };
}

export function TestimonialSection({ testimonials, brand }: TestimonialsProps) {
  if (!testimonials || testimonials.length === 0) return null;

  const colorMap = {
    amber: 'text-amber-600 bg-amber-100',
    indigo: 'text-indigo-600 bg-indigo-100',
    rose: 'text-rose-600 bg-rose-100',
    emerald: 'text-emerald-600 bg-emerald-100',
    slate: 'text-slate-800 bg-slate-200',
  };

  const labelColorMap = {
    amber: 'text-amber-600',
    indigo: 'text-indigo-600',
    rose: 'text-rose-600',
    emerald: 'text-emerald-600',
    slate: 'text-slate-500',
  };

  const radiusMap = {
    none: 'rounded-none',
    md: 'rounded-2xl',
    full: 'rounded-[2rem]',
  };

  const isDark = brand?.variant === 'dark' || brand?.variant === 'glassmorphism';
  const isGlass = brand?.variant === 'glassmorphism';

  return (
    <section className={`py-24 sm:py-32 ${isDark ? 'bg-[#0a0a0f]' : 'bg-slate-50'}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className={`text-lg font-semibold leading-8 tracking-tight ${labelColorMap[brand?.colorTheme as keyof typeof labelColorMap] || labelColorMap.indigo}`}>Testimonials</h2>
          <p className={`mt-2 text-3xl font-bold tracking-tight sm:text-4xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Loved by founders everywhere
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, idx) => (
              <div 
                key={idx} 
                className={`p-8 text-sm leading-6 transition-all hover:scale-[1.02] ${
                  isGlass 
                    ? 'bg-white/5 backdrop-blur-xl border border-white/10' 
                    : isDark 
                      ? 'bg-slate-900/50 border border-slate-800 shadow-xl shadow-black/20' 
                      : 'bg-white shadow-sm ring-1 ring-slate-200'
                } ${radiusMap[brand?.borderRadius as keyof typeof radiusMap] || radiusMap.md}`}
              >
                <figure className="h-full flex flex-col justify-between">
                  <blockquote className={`${isDark ? 'text-slate-300' : 'text-slate-900'} italic`}>
                    <p>"{testimonial.content}"</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-x-4">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg ${colorMap[brand?.colorTheme as keyof typeof colorMap] || colorMap.indigo} ${brand?.borderRadius === 'none' ? 'rounded-none' : 'rounded-full'}`}>
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{testimonial.name}</div>
                      <div className={isDark ? 'text-slate-500' : 'text-slate-600'}>{testimonial.role}</div>
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

