import React from 'react';
import * as Icons from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  iconName: string;
}

interface FeaturesProps {
  features: Feature[];
}

export function FeaturesSection({ features }: FeaturesProps) {
  return (
    <section className="bg-slate-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Powerful features designed to help you succeed.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, idx) => {
              // @ts-ignore
              const Icon = Icons[feature.iconName] || Icons.CheckCircle;
              return (
                <div key={idx} className="flex flex-col rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md hover:-translate-y-1">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                    <Icon className="h-6 w-6 flex-none text-indigo-600" aria-hidden="true" />
                    {feature.title}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
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
