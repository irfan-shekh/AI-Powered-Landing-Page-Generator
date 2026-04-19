import React from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  headline: string;
  subheadline: string;
  ctaText: string;
}

export function HeroSection({ headline, subheadline, ctaText }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-slate-900 pt-24 pb-32 lg:pt-36 lg:pb-40 text-center">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      <div className="absolute top-0 right-0 -mr-40 -mt-40 h-[500px] w-[500px] rounded-full bg-indigo-500/30 blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 h-[500px] w-[500px] rounded-full bg-blue-500/30 blur-[100px]"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl"
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {headline}
          </h1>
          <p className="mt-6 text-xl text-slate-300">
            {subheadline}
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <button className="rounded-full bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all">
              {ctaText}
            </button>
            <button className="rounded-full bg-white/10 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-white/20 transition-all backdrop-blur-sm">
              Learn more
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
