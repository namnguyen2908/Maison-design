"use client";

import dynamic from "next/dynamic";

const HeroSection = dynamic(
  () => import("@/components/home/hero").then((m) => m.HeroSection),
  { ssr: true },
);

const ProblemSection = dynamic(
  () => import("@/components/home/problem").then((m) => m.ProblemSection),
  { ssr: false, loading: () => <div className="h-screen bg-bg" /> },
);

const ApproachSection = dynamic(
  () => import("@/components/home/approach").then((m) => m.ApproachSection),
  { ssr: false, loading: () => <div className="h-96 bg-surface" /> },
);

const ReviewSection = dynamic(
  () => import("@/components/home/review").then((m) => m.ReviewSection),
  {
    ssr: false,
    loading: () => <div className="h-screen bg-gradient-to-b from-bg to-surface" />,
  },
);

const TimelineSection = dynamic(
  () => import("@/components/home/timeline").then((m) => m.TimelineSection),
  { ssr: false, loading: () => <div className="h-screen bg-bg" /> },
);

const DesignersSection = dynamic(
  () => import("@/components/home/designers").then((m) => m.DesignersSection),
  { ssr: false, loading: () => <div className="h-[80vh] bg-surface" /> },
);

const PortfolioSection = dynamic(
  () => import("@/components/home/portfolio").then((m) => m.PortfolioSection),
  { ssr: false, loading: () => <div className="h-[100vh] bg-bg" /> },
);

const TestimonialsSection = dynamic(
  () => import("@/components/home/testimonials").then((m) => m.TestimonialsSection),
  { ssr: false, loading: () => <div className="h-[80vh] bg-surface" /> },
);

const BrandStatementSection = dynamic(
  () => import("@/components/home/brand-statement").then((m) => m.BrandStatementSection),
  { ssr: false, loading: () => <div className="h-[80vh] bg-text" /> },
);

const CTASection = dynamic(
  () => import("@/components/home/cta").then((m) => m.CTASection),
  { ssr: false, loading: () => <div className="h-screen bg-bg" /> },
);

function Spacer() {
  return <div className="h-16 md:h-24" />;
}

function DarkToLightSpacer() {
  return (
    <div className="h-24 md:h-36 bg-gradient-to-b from-[#2C2822] to-bg" />
  );
}

function LightToDarkSpacer() {
  return (
    <div className="h-24 md:h-36 bg-gradient-to-b from-bg to-text" />
  );
}

export function DynamicHome() {
  return (
    <main>
      <HeroSection />
      <DarkToLightSpacer />
      <ProblemSection />
      <Spacer />
      <ApproachSection />
      <Spacer />
      <ReviewSection />
      <Spacer />
      <TimelineSection />
      <Spacer />
      <DesignersSection />
      <Spacer />
      <PortfolioSection />
      <Spacer />
      <TestimonialsSection />
      <LightToDarkSpacer />
      <BrandStatementSection />
      <DarkToLightSpacer />
      <CTASection />
    </main>
  );
}
