export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  photo?: string;
  text: string;
  rating?: number; // 1–5
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface LandingPageConfig {
  // Hero
  heroVideoUrl?: string;
  heroSubtitle?: string;

  // Trust Bar
  showTrustBar?: boolean;

  // Testimonials
  showTestimonials?: boolean;
  testimonials?: Testimonial[];

  // About Master
  showAboutMaster?: boolean;
  aboutMasterText?: string;

  // FAQ
  showFaq?: boolean;
  faq?: FaqItem[];

  // Floating CTA
  showFloatingCta?: boolean;
}
