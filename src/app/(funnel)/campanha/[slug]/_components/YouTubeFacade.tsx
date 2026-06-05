"use client";

import { useState } from "react";
import Image from "next/image";

interface YouTubeFacadeProps {
  videoId: string;
  title: string;
}

/**
 * Facade para vídeos do YouTube.
 *
 * Problema com iframe direto:
 * - Carrega ~300 KB de JS do YouTube imediatamente
 * - Seta 4 cookies de terceiros (bloqueados em Chrome em breve)
 * - Bloqueia a thread principal durante o parse/exec
 *
 * Esta facade exibe apenas a thumbnail (via next/image) até o clique.
 * O iframe real é criado só quando o usuário interage — zero impacto no LCP/TBT.
 */
export function YouTubeFacade({ videoId, title }: YouTubeFacadeProps) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative h-full w-full cursor-pointer"
      aria-label={`Reproduzir vídeo: ${title}`}
    >
      {/* Thumbnail via next/image — otimizada, sem cookies */}
      <Image
        src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 896px"
        priority
      />

      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/20" />

      {/* Botão de play no estilo YouTube */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-2xl shadow-black/60 transition-transform group-hover:scale-110">
          <svg
            className="h-6 w-6 translate-x-0.5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Label sutil */}
      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white/70 backdrop-blur-sm">
        Clique para reproduzir
      </span>
    </button>
  );
}
