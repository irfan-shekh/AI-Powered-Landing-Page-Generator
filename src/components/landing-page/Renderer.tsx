import React from 'react';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { TestimonialSection } from './TestimonialSection';
import { PricingSection } from './PricingSection';
import { CtaSection } from './CtaSection';

export interface LandingPageData {
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
  };
  features: Array<{
    title: string;
    description: string;
    iconName: string;
  }>;
  testimonials?: Array<{
    name: string;
    role: string;
    content: string;
  }>;
  pricing?: Array<{
    plan: string;
    price: string;
    features: string[];
    isPopular?: boolean;
  }>;
  cta: {
    headline: string;
    subheadline: string;
    buttonText: string;
  };
}

interface RendererProps {
  data: LandingPageData;
}

export function LandingPageRenderer({ data }: RendererProps) {
  if (!data) return null;

  return (
    <div className="min-h-screen bg-white">
      <HeroSection {...data.hero} />
      <FeaturesSection features={data.features} />
      {data.testimonials && <TestimonialSection testimonials={data.testimonials} />}
      {data.pricing && <PricingSection pricing={data.pricing} />}
      <CtaSection {...data.cta} />
    </div>
  );
}
