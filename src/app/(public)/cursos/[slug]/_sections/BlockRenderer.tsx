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

function resolveCloudinaryUrl(url: string) {
  if (!url) return url;
  if (url.startsWith("http")) return url;
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/q_auto,f_auto/${url}`;
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
  const src = resolveCloudinaryUrl(block.url);
  return (
    <section className={isContained ? "py-10" : ""}>
      <div className={isContained ? "mx-auto max-w-4xl px-6 lg:px-12" : "w-full"}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
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
  const mode = block.ctaType ?? "course";

  let buttonNode: React.ReactNode;

  if (mode === "url" && block.ctaUrl) {
    const isExternal = block.ctaUrl.startsWith("http");
    buttonNode = isExternal ? (
      <a
        href={block.ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-8 py-4 font-bold text-black"
      >
        {block.ctaButtonText || "Saiba Mais"}
      </a>
    ) : (
      <Link
        href={block.ctaUrl}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-8 py-4 font-bold text-black"
      >
        {block.ctaButtonText || "Saiba Mais"}
      </Link>
    );
  } else if (mode === "whatsapp") {
    const number = (block.ctaWhatsappNumber ?? "").replace(/\D/g, "");
    const message = block.ctaWhatsappMessage ?? "";
    const waUrl = `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
    buttonNode = (
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-green-600 to-green-500 px-8 py-4 font-bold text-white"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        {block.ctaButtonText || "Falar no WhatsApp"}
      </a>
    );
  } else {
    // mode === "course" — usa lógica do curso
    buttonNode = isEnrolled ? (
      <Link
        href={firstLessonId ? `/cursos/${slug}/${firstLessonId}` : `/dashboard/meus-cursos`}
        className="rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-8 py-4 font-bold text-black"
      >
        {block.ctaButtonText || "Acessar Curso"}
      </Link>
    ) : isWhatsappLead ? (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-green-600 px-8 py-4 font-semibold text-white hover:bg-green-500"
      >
        {block.ctaButtonText || "Falar no WhatsApp"}
      </a>
    ) : (
      <Link
        href={`/login?callbackUrl=/cursos/${slug}`}
        className="rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-8 py-4 font-bold text-black"
      >
        {block.ctaButtonText || (hasSession ? "Comprar Agora" : "Entrar para Comprar")}
        {priceLabel && ` — ${priceLabel}`}
      </Link>
    );
  }

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
          {buttonNode}
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
