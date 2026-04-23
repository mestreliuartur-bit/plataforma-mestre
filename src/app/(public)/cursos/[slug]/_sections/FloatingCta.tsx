"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Props {
  slug: string;
  price: string | null;
  isEnrolled: boolean;
  isWhatsappLead: boolean;
  whatsappUrl: string;
  firstLessonId: string | null;
  hasSession: boolean;
}

export function FloatingCta({
  slug,
  price,
  isEnrolled,
  isWhatsappLead,
  whatsappUrl,
  firstLessonId,
  hasSession,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-white/10 bg-[#0a0a0f]/95 px-4 py-3 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <div className="hidden sm:block">
          {price && !isEnrolled && !isWhatsappLead && (
            <p className="font-serif text-lg font-bold text-amber-400">{price}</p>
          )}
          {isEnrolled && (
            <p className="text-sm font-semibold text-emerald-400">Você já tem acesso</p>
          )}
        </div>

        <div className="flex flex-1 items-center justify-center gap-3 sm:flex-none">
          {isEnrolled ? (
            <Link
              href={firstLessonId ? `/cursos/${slug}/${firstLessonId}` : `/dashboard/meus-cursos`}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-2.5 text-sm font-bold text-black shadow-lg shadow-amber-900/30"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
              Continuar Curso
            </Link>
          ) : isWhatsappLead ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-green-600 px-6 py-2.5 text-sm font-bold text-white"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Falar no WhatsApp
            </a>
          ) : (
            <Link
              href={`/login?callbackUrl=/cursos/${slug}`}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-2.5 text-sm font-bold text-black shadow-lg shadow-amber-900/30"
            >
              {hasSession ? "Comprar Agora" : "Entrar para Comprar"}
              {price && (
                <span className="rounded-full bg-black/20 px-2 py-0.5 text-xs">{price}</span>
              )}
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Fechar"
          className="flex-shrink-0 rounded-lg p-1.5 text-gray-600 hover:text-gray-400"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
