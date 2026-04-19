import React from 'react';
import { CheckCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PricingPlan {
  plan: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

interface PricingProps {
  pricing: PricingPlan[];
}

export function PricingSection({ pricing }: PricingProps) {
  if (!pricing || pricing.length === 0) return null;

  return (
    <section className="bg-slate-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-400">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Pricing plans for teams of all sizes
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-slate-300">
          Choose an affordable plan that's packed with the best features for engaging your audience.
        </p>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2">
          {pricing.map((tier, idx) => (
            <div
              key={idx}
              className={cn(
                tier.isPopular ? 'bg-white/5 ring-2 ring-indigo-500' : 'ring-1 ring-white/10',
                'rounded-3xl p-8 xl:p-10 transition-all hover:bg-white/10 relative'
              )}
            >
              {tier.isPopular && (
                <div className="absolute top-0 right-6 -translate-y-1/2">
                  <span className="inline-flex rounded-full bg-indigo-500 px-3 py-1 text-sm font-semibold text-white shadow-sm">
                    Most popular
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between gap-x-4">
                <h3 className={cn(tier.isPopular ? 'text-indigo-400' : 'text-white', 'text-lg font-semibold leading-8')}>
                  {tier.plan}
                </h3>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">Everything you need to get started.</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-white">{tier.price}</span>
              </p>
              <a
                href="#"
                className={cn(
                  tier.isPopular
                    ? 'bg-indigo-500 text-white hover:bg-indigo-400 focus-visible:outline-indigo-500'
                    : 'bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white',
                  'mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all'
                )}
              >
                Get started
              </a>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-300 xl:mt-10">
                {tier.features.map((feature, featureIdx) => (
                  <li key={featureIdx} className="flex gap-x-3 items-center">
                    <CheckCircle className="h-5 w-5 flex-none text-indigo-400" aria-hidden="true" />
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
