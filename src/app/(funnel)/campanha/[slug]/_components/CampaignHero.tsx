"use client";

import Image from "next/image";
import Link from "next/link";
import { YouTubeFacade } from "./YouTubeFacade";

interface CampaignHeroProps {
  headline: string;
  subtitle?: string | null;
  mediaType: "VIDEO" | "IMAGE";
  mediaUrl?: string | null;
  ctaLabel: string;
  ctaUrl: string;
}

export function CampaignHero({
  headline,
  subtitle,
  mediaType,
  mediaUrl,
  ctaLabel,
  ctaUrl,
}: CampaignHeroProps) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0a0f] px-4 py-20">
      {/* Ambient glow background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-amber-500/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[600px] rounded-full bg-purple-900/10 blur-[100px]" />
        {/* StarField CSS puro — substitui 50 divs animados na main thread */}
        <div className="hero-stars absolute inset-0" />
      </div>

      {/* Sigil ornament */}
      <div aria-hidden className="relative z-10 mb-8">
        <svg viewBox="0 0 100 100" className="mx-auto h-12 w-12 text-amber-400/40" fill="currentColor">
          <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
        </svg>
      </div>

      {/* Headline */}
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h1 className="font-serif text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          {headline}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400 sm:text-xl">
            {subtitle}
          </p>
        )}
      </div>

      {/* Media */}
      {mediaUrl && (
        <div className="relative z-10 mt-12 w-full max-w-3xl">
          <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/60">
            {mediaType === "VIDEO" ? (
              <div className="aspect-video w-full">
                {/*
                  YouTubeFacade: exibe thumbnail estática até o clique.
                  Evita carregar ~300KB de JS do YouTube + 4 cookies de terceiros
                  durante a renderização inicial — impacto direto no TBT e LCP.
                */}
                <YouTubeFacade
                  videoId={extractYouTubeId(mediaUrl)}
                  title={headline}
                />
              </div>
            ) : (
              <div className="relative aspect-video w-full">
                <Image
                  src={
                    mediaUrl.startsWith("http")
                      ? mediaUrl
                      : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,w_1200/${mediaUrl}`
                  }
                  alt={headline}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 896px"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* CTA Button */}
      <div className="relative z-10 mt-12">
        <CtaButton label={ctaLabel} href={ctaUrl} />
        <p className="mt-4 text-center text-xs text-gray-600">
          Acesso imediato · Sem riscos
        </p>
      </div>
    </section>
  );
}

// ── CTA Button ────────────────────────────────────────────────

export function CtaButton({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-amber-400 px-10 py-5 font-serif text-lg font-bold text-black shadow-lg shadow-amber-400/30 transition-all duration-300 hover:bg-amber-300 hover:shadow-xl hover:shadow-amber-400/40 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50"
    >
      <span aria-hidden className="absolute inset-0 rounded-2xl ring-2 ring-amber-400/50 animate-ping opacity-30" />
      <svg className="h-5 w-5 flex-shrink-0 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
      {label}
    </Link>
  );
}

// ── Helper ────────────────────────────────────────────────────

function extractYouTubeId(url: string): string {
  const match =
    url.match(/youtu\.be\/([^?&]+)/) ||
    url.match(/[?&]v=([^&]+)/) ||
    url.match(/embed\/([^?&]+)/);
  return match ? match[1] : url;
}
