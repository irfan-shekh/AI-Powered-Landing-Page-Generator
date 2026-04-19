import React from 'react';

interface CtaProps {
  headline: string;
  subheadline: string;
  buttonText: string;
}

export function CtaSection({ headline, subheadline, buttonText }: CtaProps) {
  return (
    <section className="bg-indigo-100">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {headline}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600">
            {subheadline}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
            >
              {buttonText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
