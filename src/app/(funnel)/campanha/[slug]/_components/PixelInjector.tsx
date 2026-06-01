"use client";

import { useEffect } from "react";

interface PixelInjectorProps {
  pixelHead?: string | null;
  pixelBody?: string | null;
}

/**
 * Injeta scripts de rastreamento vindos do banco de dados.
 *
 * - pixelHead: injetado via <script> no <head> usando document.head.appendChild
 * - pixelBody: renderizado como HTML bruto no início do body via dangerouslySetInnerHTML
 *
 * Usamos um Client Component porque:
 * 1. next/script não aceita HTML arbitrário (inclui <noscript>, múltiplas tags, etc.)
 * 2. Server Components não têm acesso ao DOM para injetar no <head>
 * 3. Esta abordagem funciona com qualquer snippet de pixel sem pré-processamento
 */
export function PixelInjector({ pixelHead, pixelBody }: PixelInjectorProps) {
  useEffect(() => {
    if (!pixelHead) return;

    const container = document.createElement("div");
    container.innerHTML = pixelHead;

    const scripts = Array.from(container.querySelectorAll("script"));
    const nonScripts = Array.from(container.childNodes).filter(
      (node) => node.nodeName !== "SCRIPT"
    );

    // Injeta tags não-script diretamente (meta, noscript, etc.)
    nonScripts.forEach((node) => document.head.appendChild(node.cloneNode(true)));

    // Scripts precisam ser recriados para o browser executar o código
    scripts.forEach((originalScript) => {
      const script = document.createElement("script");
      Array.from(originalScript.attributes).forEach((attr) =>
        script.setAttribute(attr.name, attr.value)
      );
      script.textContent = originalScript.textContent;
      document.head.appendChild(script);
    });
  }, [pixelHead]);

  if (!pixelBody) return null;

  return <div dangerouslySetInnerHTML={{ __html: pixelBody }} />;
}
