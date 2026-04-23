import Link from "next/link";
import type { Block } from "@/types/landing-page";
import { TrustBar } from "./TrustBar";
import { TestimonialsSection } from "./TestimonialsSection";
import { AboutMasterSection } from "./AboutMasterSection";
import { FaqSection } from "./FaqSection";

export interface CtaProps {
  slug: string;
  isEnrolled: boolean;
  isWhatsappLead: boolean;
  whatsappUrl: string;
  priceLabel: string | null;
  firstLessonId: string | null;
  hasSession: boolean;
}

function toEmbedUrl(url: string) {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
}

const alignClass = { left: "text-left", center: "text-center", right: "text-right" };
const spacerSize = { sm: "py-8", md: "py-16", lg: "py-24" };

// ── Individual block renderers ────────────────────────────────

function HeadingBlock({ block }: { block: Block }) {
  const Tag = block.level === "h3" ? "h3" : "h2";
  const sizeClass = block.level === "h3"
    ? "font-serif text-2xl font-bold text-white lg:text-3xl"
    : "font-serif text-3xl font-bold text-white lg:text-4xl";
  return (
    <section className="py-10">
      <div className={`mx-auto max-w-4xl px-6 lg:px-12 ${alignClass[block.align ?? "left"]}`}>
        <Tag className={sizeClass}>{block.text}</Tag>
      </div>
    </section>
  );
}

function TextBlock({ block }: { block: Block }) {
  return (
    <section className="py-6">
      <div className={`mx-auto max-w-4xl px-6 lg:px-12 ${alignClass[block.align ?? "left"]}`}>
        <p className="text-lg leading-relaxed text-gray-400 whitespace-pre-line">{block.text}</p>
      </div>
    </section>
  );
}

function ImageBlock({ block }: { block: Block }) {
  if (!block.url) return null;
  const isContained = block.style === "contained";
  return (
    <section className="py-10">
      <div className={isContained ? "mx-auto max-w-4xl px-6 lg:px-12" : "w-full"}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={block.url}
          alt={block.alt ?? ""}
          className={`w-full object-cover ${isContained ? "rounded-2xl" : ""}`}
        />
        {block.caption && (
          <p className="mt-3 text-center text-sm text-gray-500">{block.caption}</p>
        )}
      </div>
    </section>
  );
}

function VideoBlock({ block }: { block: Block }) {
  if (!block.url) return null;
  const embedUrl = toEmbedUrl(block.url);
  return (
    <section className="bg-black">
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        <iframe
          src={embedUrl}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={block.caption ?? "Vídeo"}
        />
      </div>
      {block.caption && (
        <p className="py-3 text-center text-sm text-gray-500">{block.caption}</p>
      )}
    </section>
  );
}

function CtaBlock({ block, ctaProps }: { block: Block; ctaProps: CtaProps }) {
  const { slug, isEnrolled, isWhatsappLead, whatsappUrl, priceLabel, firstLessonId, hasSession } = ctaProps;
  return (
    <section className="border-t border-white/5 py-20">
      <div className="mx-auto max-w-2xl px-6 text-center">
        {block.heading && (
          <h2 className="font-serif text-3xl font-bold text-white">{block.heading}</h2>
        )}
        {block.text && (
          <p className="mt-4 text-gray-400">{block.text}</p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {isEnrolled ? (
            <Link
              href={firstLessonId ? `/cursos/${slug}/${firstLessonId}` : `/dashboard/meus-cursos`}
              className="rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-8 py-4 font-bold text-black"
            >
              Acessar Curso
            </Link>
          ) : isWhatsappLead ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-green-600 px-8 py-4 font-semibold text-white hover:bg-green-500"
            >
              Falar no WhatsApp
            </a>
          ) : (
            <Link
              href={`/login?callbackUrl=/cursos/${slug}`}
              className="rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-8 py-4 font-bold text-black"
            >
              {hasSession ? "Comprar Agora" : "Entrar para Comprar"}
              {priceLabel && ` — ${priceLabel}`}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

function DividerBlock() {
  return (
    <div className="mx-auto max-w-4xl px-6 lg:px-12">
      <hr className="border-white/10" />
    </div>
  );
}

function SpacerBlock({ block }: { block: Block }) {
  return <div className={spacerSize[block.size ?? "md"]} aria-hidden="true" />;
}

// ── Main dispatcher ───────────────────────────────────────────

export function BlockRenderer({ block, ctaProps }: { block: Block; ctaProps: CtaProps }) {
  if (block.visible === false) return null;

  switch (block.type) {
    case "heading":
      return <HeadingBlock block={block} />;
    case "text":
      return <TextBlock block={block} />;
    case "image":
      return <ImageBlock block={block} />;
    case "video":
      return <VideoBlock block={block} />;
    case "trust_bar":
      return <TrustBar />;
    case "testimonials":
      return block.testimonials?.length
        ? <TestimonialsSection testimonials={block.testimonials} />
        : null;
    case "about_master":
      return <AboutMasterSection customText={block.customText} />;
    case "faq":
      return block.faq?.length
        ? <FaqSection faq={block.faq} />
        : null;
    case "cta":
      return <CtaBlock block={block} ctaProps={ctaProps} />;
    case "divider":
      return <DividerBlock />;
    case "spacer":
      return <SpacerBlock block={block} />;
    default:
      return null;
  }
}
