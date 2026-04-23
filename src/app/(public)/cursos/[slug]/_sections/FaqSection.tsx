"use client";

import { useState } from "react";
import type { FaqItem } from "@/types/landing-page";

interface Props {
  faq: FaqItem[];
}

export function FaqSection({ faq }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (!faq.length) return null;

  return (
    <section className="border-t border-white/5 py-20">
      <div className="mx-auto max-w-3xl px-6 lg:px-12">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-400/60">
            Dúvidas Frequentes
          </p>
          <h2 className="font-serif text-3xl font-bold text-white">Perguntas & Respostas</h2>
        </div>

        <div className="space-y-3">
          {faq.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  isOpen ? "border-amber-400/20 bg-amber-400/[0.03]" : "border-white/5 bg-white/[0.02]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="flex w-full items-center gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="flex-1 text-sm font-semibold text-white">{item.question}</span>
                  <svg
                    className={`h-5 w-5 flex-shrink-0 text-amber-400/60 transition-transform duration-200 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="border-t border-white/5 px-6 pb-5 pt-4">
                    <p className="text-sm leading-relaxed text-gray-400 whitespace-pre-line">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
