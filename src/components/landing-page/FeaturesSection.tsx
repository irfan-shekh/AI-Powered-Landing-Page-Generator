import React from 'react';
import * as Icons from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  iconName: string;
}

interface FeaturesProps {
  features: Feature[];
  brand: {
    colorTheme: 'amber' | 'indigo' | 'rose' | 'emerald' | 'slate';
    variant: 'dark' | 'light' | 'glassmorphism';
    borderRadius: 'none' | 'md' | 'full';
  };
}

export function FeaturesSection({ features, brand }: FeaturesProps) {
  const iconColorMap = {
    amber: 'text-amber-600',
    indigo: 'text-indigo-600',
    rose: 'text-rose-600',
    emerald: 'text-emerald-600',
    slate: 'text-slate-800',
  };

  const radiusMap = {
    none: 'rounded-none',
    md: 'rounded-2xl',
    full: 'rounded-[2rem]',
  };

  const isDark = brand?.variant === 'dark' || brand?.variant === 'glassmorphism';
  const isGlass = brand?.variant === 'glassmorphism';

  return (
    <section className={`py-24 sm:py-32 ${isDark ? 'bg-[#0a0a0f]' : 'bg-white'}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className={`text-3xl font-bold tracking-tight sm:text-4xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Supercharge Your Workflow
          </h2>
          <p className={`mt-6 text-lg leading-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Everything you need to scale, all in one place. Focus on what matters.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, idx) => {
              // @ts-ignore
              const Icon = Icons[feature.iconName] || Icons.CheckCircle;
              return (
                <div 
                  key={idx} 
                  className={`flex flex-col p-8 transition-all hover:-translate-y-1 ${
                    isGlass 
                      ? 'bg-white/5 backdrop-blur-xl border border-white/10' 
                      : isDark 
                        ? 'bg-slate-900/50 border border-slate-800' 
                        : 'bg-slate-50 border border-slate-100'
                  } ${radiusMap[brand?.borderRadius as keyof typeof radiusMap] || radiusMap.md} ${isDark ? 'hover:bg-white/10' : 'hover:shadow-xl hover:shadow-slate-200/50'}`}
                >
                  <dt className={`flex items-center gap-x-3 text-lg font-bold leading-7 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
                      <Icon className={`h-6 w-6 flex-none ${iconColorMap[brand?.colorTheme as keyof typeof iconColorMap] || iconColorMap.indigo}`} aria-hidden="true" />
                    </div>
                    {feature.title}
                  </dt>
                  <dd className={`mt-4 flex flex-auto flex-col text-base leading-7 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
