"use client";

import React from 'react';
import { HeroSection } from './HeroSection';
import { ProblemSection } from './ProblemSection';
import { FeaturesSection } from './FeaturesSection';
import { TestimonialSection } from './TestimonialSection';
import { PricingSection } from './PricingSection';
import { CtaSection } from './CtaSection';

// 1. Updated Interface to include the brand/theme object
export interface LandingPageData {
  brand: {
    name: string;
    tagline: string;
    tone: string;
    colorTheme: 'amber' | 'indigo' | 'rose' | 'emerald' | 'slate';
    variant: 'dark' | 'light' | 'glassmorphism';
    borderRadius: 'none' | 'md' | 'full';
  };
  problem: {
    headline: string;
    description: string;
  };
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

  const defaultBrand = {
    name: 'Startup',
    tagline: 'The future is here',
    tone: 'modern',
    colorTheme: 'indigo' as const,
    variant: 'dark' as const,
    borderRadius: 'md' as const,
  };

  const brand = data.brand || defaultBrand;

  return (
    <div className={`min-h-screen ${brand.variant === 'dark' ? 'bg-[#0a0a0f]' : 'bg-white'}`}>
      {/* 3. Pass the brand/theme prop to ALL sections */}
      <HeroSection {...data.hero} brand={brand} />
      <ProblemSection {...data.problem} brand={brand} />
      <FeaturesSection features={data.features} brand={brand} />
      {data.testimonials && <TestimonialSection testimonials={data.testimonials} brand={brand} />}
      {data.pricing && <PricingSection pricing={data.pricing} brand={brand} />}
      <CtaSection {...data.cta} brand={brand} />
    </div>
  );
}