export type BlockType =
  | "heading"
  | "text"
  | "image"
  | "video"
  | "columns"
  | "trust_bar"
  | "testimonials"
  | "about_master"
  | "faq"
  | "cta"
  | "divider"
  | "spacer";

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  photo?: string;
  text: string;
  rating?: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface Column {
  id: string;
  imageUrl?: string;
  heading?: string;
  text?: string;
  align?: "left" | "center" | "right";
}

export interface Block {
  id: string;
  type: BlockType;
  visible: boolean;
  // Content fields — only relevant ones used per block type
  text?: string;              // heading, text, cta body
  level?: "h2" | "h3";       // heading
  align?: "left" | "center" | "right"; // heading, text
  url?: string;               // image, video
  alt?: string;               // image
  caption?: string;           // image, video
  size?: "sm" | "md" | "lg"; // spacer
  style?: "full" | "contained"; // image layout
  customText?: string;        // about_master bio override
  masterPhoto?: string;       // about_master photo
  heading?: string;           // cta section heading
  ctaType?: "course" | "url" | "whatsapp";
  ctaUrl?: string;
  ctaWhatsappNumber?: string;
  ctaWhatsappMessage?: string;
  ctaButtonText?: string;
  testimonials?: Testimonial[];
  faq?: FaqItem[];
  columnCount?: 2 | 3;        // columns block
  columns?: Column[];         // columns block
}

export interface LandingPageConfig {
  heroSubtitle?: string;
  showFloatingCta?: boolean;
  blocks?: Block[];
}
