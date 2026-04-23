"use client";

import { useState } from "react";
import type { Block, BlockType, Testimonial, FaqItem, Column } from "@/types/landing-page";
import { CloudinaryUpload } from "@/components/ui/CloudinaryUpload";

// ── Block type catalogue ──────────────────────────────────────

interface BlockDef {
  type: BlockType;
  label: string;
  desc: string;
  defaults: Partial<Block>;
}

const BLOCK_DEFS: BlockDef[] = [
  { type: "heading",      label: "Cabeçalho",          desc: "Título H2 ou H3",              defaults: { text: "", level: "h2", align: "left" } },
  { type: "text",         label: "Parágrafo",           desc: "Bloco de texto",               defaults: { text: "", align: "left" } },
  { type: "image",        label: "Imagem",              desc: "Foto ou banner",               defaults: { url: "", style: "full" } },
  { type: "video",        label: "Vídeo",               desc: "YouTube ou Vimeo",             defaults: { url: "" } },
  { type: "trust_bar",    label: "Barra de Confiança",  desc: "Garantias e selos",            defaults: {} },
  { type: "testimonials", label: "Depoimentos",         desc: "Relatos de alunos",            defaults: { testimonials: [] } },
  { type: "about_master", label: "Sobre o Mestre",      desc: "Bio e autoridade",             defaults: {} },
  { type: "faq",          label: "FAQ",                 desc: "Perguntas e respostas",        defaults: { faq: [] } },
  { type: "cta",          label: "Chamada para Ação",   desc: "Seção de conversão",           defaults: { heading: "Pronto para começar?", text: "" } },
  { type: "columns",      label: "Colunas",             desc: "2 ou 3 colunas lado a lado",  defaults: { columnCount: 2, columns: [] } },
  { type: "divider",      label: "Divisor",             desc: "Linha separadora",             defaults: {} },
  { type: "spacer",       label: "Espaçador",           desc: "Espaço em branco",             defaults: { size: "md" } },
];

const TYPE_LABEL: Record<BlockType, string> = Object.fromEntries(
  BLOCK_DEFS.map((d) => [d.type, d.label])
) as Record<BlockType, string>;

// ── Helpers ───────────────────────────────────────────────────

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/20";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// ── Align control ─────────────────────────────────────────────

function AlignControl({
  value,
  onChange,
}: {
  value?: string;
  onChange: (v: "left" | "center" | "right") => void;
}) {
  const opts: { v: "left" | "center" | "right"; label: string }[] = [
    { v: "left", label: "Esq" },
    { v: "center", label: "Centro" },
    { v: "right", label: "Dir" },
  ];
  return (
    <div className="flex gap-1">
      {opts.map((o) => (
        <button
          key={o.v}
          type="button"
          onClick={() => onChange(o.v)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            value === o.v
              ? "bg-amber-400/20 text-amber-400"
              : "border border-white/10 text-gray-500 hover:text-white"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ── Block edit forms (per type) ───────────────────────────────

function BlockEditForm({
  block,
  onUpdate,
}: {
  block: Block;
  onUpdate: (patch: Partial<Block>) => void;
}) {
  switch (block.type) {
    // ── Heading ──
    case "heading":
      return (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Texto *</label>
            <input
              type="text"
              value={block.text ?? ""}
              onChange={(e) => onUpdate({ text: e.target.value })}
              placeholder="Título da seção"
              className={inputClass}
            />
          </div>
          <div className="flex items-center gap-6">
            <div>
              <label className={labelClass}>Nível</label>
              <div className="flex gap-1">
                {(["h2", "h3"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => onUpdate({ level: l })}
                    className={`rounded-lg px-4 py-1.5 text-sm font-bold transition-colors ${
                      block.level === l
                        ? "bg-amber-400/20 text-amber-400"
                        : "border border-white/10 text-gray-500 hover:text-white"
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Alinhamento</label>
              <AlignControl value={block.align} onChange={(v) => onUpdate({ align: v })} />
            </div>
          </div>
        </div>
      );

    // ── Text ──
    case "text":
      return (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Texto *</label>
            <textarea
              value={block.text ?? ""}
              onChange={(e) => onUpdate({ text: e.target.value })}
              rows={5}
              placeholder="Seu texto aqui..."
              className={`${inputClass} resize-none leading-relaxed`}
            />
          </div>
          <div>
            <label className={labelClass}>Alinhamento</label>
            <AlignControl value={block.align} onChange={(v) => onUpdate({ align: v })} />
          </div>
        </div>
      );

    // ── Image ──
    case "image":
      return (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Imagem *</label>
            <CloudinaryUpload value={block.url ?? ""} onChange={(url) => onUpdate({ url })} />
          </div>
          <div>
            <label className={labelClass}>Texto alternativo</label>
            <input
              type="text"
              value={block.alt ?? ""}
              onChange={(e) => onUpdate({ alt: e.target.value })}
              placeholder="Descrição da imagem"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Legenda</label>
            <input
              type="text"
              value={block.caption ?? ""}
              onChange={(e) => onUpdate({ caption: e.target.value })}
              placeholder="Legenda abaixo da imagem (opcional)"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Layout</label>
            <div className="flex gap-2">
              {(["full", "contained"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onUpdate({ style: s })}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                    block.style === s
                      ? "bg-amber-400/20 text-amber-400"
                      : "border border-white/10 text-gray-500 hover:text-white"
                  }`}
                >
                  {s === "full" ? "Tela cheia" : "Centralizada"}
                </button>
              ))}
            </div>
          </div>
        </div>
      );

    // ── Video ──
    case "video":
      return (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>URL do vídeo *</label>
            <input
              type="text"
              value={block.url ?? ""}
              onChange={(e) => onUpdate({ url: e.target.value })}
              placeholder="https://youtu.be/... ou https://vimeo.com/..."
              className={inputClass}
            />
            <p className="mt-1 text-[11px] text-gray-600">Aceita YouTube e Vimeo</p>
          </div>
          <div>
            <label className={labelClass}>Legenda</label>
            <input
              type="text"
              value={block.caption ?? ""}
              onChange={(e) => onUpdate({ caption: e.target.value })}
              placeholder="Legenda abaixo do vídeo (opcional)"
              className={inputClass}
            />
          </div>
        </div>
      );

    // ── Trust bar ──
    case "trust_bar":
      return (
        <p className="text-sm text-gray-500">
          Exibe automaticamente: Pagamento Seguro · Garantia 7 Dias · Acesso Imediato · Acesso Vitalício.
        </p>
      );

    // ── Testimonials ──
    case "testimonials": {
      const testimonials = block.testimonials ?? [];
      function addT() {
        onUpdate({ testimonials: [...testimonials, { id: uid(), name: "", text: "", rating: 5 }] });
      }
      function updateT(id: string, patch: Partial<Testimonial>) {
        onUpdate({ testimonials: testimonials.map((t) => (t.id === id ? { ...t, ...patch } : t)) });
      }
      function removeT(id: string) {
        onUpdate({ testimonials: testimonials.filter((t) => t.id !== id) });
      }
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">{testimonials.length} depoimento{testimonials.length !== 1 ? "s" : ""}</p>
            <button
              type="button"
              onClick={addT}
              className="flex items-center gap-1.5 rounded-lg border border-amber-400/30 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:border-amber-400/60"
            >
              + Adicionar
            </button>
          </div>
          {testimonials.length === 0 && (
            <p className="py-4 text-center text-xs text-gray-600">Clique em &ldquo;Adicionar&rdquo; para começar.</p>
          )}
          {testimonials.map((t, i) => (
            <div key={t.id} className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Depoimento {i + 1}</span>
                <button type="button" onClick={() => removeT(t.id)} className="text-xs text-red-500/60 hover:text-red-400">Remover</button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Nome *</label>
                  <input type="text" value={t.name} onChange={(e) => updateT(t.id, { name: e.target.value })} placeholder="Maria Silva" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Cargo</label>
                  <input type="text" value={t.role ?? ""} onChange={(e) => updateT(t.id, { role: e.target.value })} placeholder="Aluna, SP" className={inputClass} />
                </div>
              </div>
              <div className="mt-3">
                <label className={labelClass}>Foto</label>
                <CloudinaryUpload value={t.photo ?? ""} onChange={(url) => updateT(t.id, { photo: url })} />
              </div>
              <div className="mt-3">
                <label className={labelClass}>Depoimento *</label>
                <textarea value={t.text} onChange={(e) => updateT(t.id, { text: e.target.value })} rows={3} placeholder="O que o aluno disse..." className={`${inputClass} resize-none`} />
              </div>
              <div className="mt-3">
                <label className={labelClass}>Estrelas</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => updateT(t.id, { rating: s })} className={(t.rating ?? 5) >= s ? "text-amber-400" : "text-gray-700"}>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // ── About master ──
    case "about_master":
      return (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Foto do Mestre</label>
            <CloudinaryUpload value={block.masterPhoto ?? ""} onChange={(url) => onUpdate({ masterPhoto: url })} />
            <p className="mt-1.5 text-[11px] text-gray-600">Recomendado: foto quadrada ou proporção 1:1.</p>
          </div>
          <div>
            <label className={labelClass}>Bio customizada (opcional)</label>
            <textarea
              value={block.customText ?? ""}
              onChange={(e) => onUpdate({ customText: e.target.value })}
              rows={5}
              placeholder="Deixe em branco para exibir o texto padrão do Mestre."
              className={`${inputClass} resize-none leading-relaxed`}
            />
          </div>
        </div>
      );

    // ── FAQ ──
    case "faq": {
      const faq = block.faq ?? [];
      function addF() {
        onUpdate({ faq: [...faq, { id: uid(), question: "", answer: "" }] });
      }
      function updateF(id: string, patch: Partial<FaqItem>) {
        onUpdate({ faq: faq.map((f) => (f.id === id ? { ...f, ...patch } : f)) });
      }
      function removeF(id: string) {
        onUpdate({ faq: faq.filter((f) => f.id !== id) });
      }
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">{faq.length} pergunta{faq.length !== 1 ? "s" : ""}</p>
            <button type="button" onClick={addF} className="flex items-center gap-1.5 rounded-lg border border-amber-400/30 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:border-amber-400/60">
              + Adicionar
            </button>
          </div>
          {faq.length === 0 && (
            <p className="py-4 text-center text-xs text-gray-600">Clique em &ldquo;Adicionar&rdquo; para começar.</p>
          )}
          {faq.map((f, i) => (
            <div key={f.id} className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Pergunta {i + 1}</span>
                <button type="button" onClick={() => removeF(f.id)} className="text-xs text-red-500/60 hover:text-red-400">Remover</button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Pergunta *</label>
                  <input type="text" value={f.question} onChange={(e) => updateF(f.id, { question: e.target.value })} placeholder="Ex: Quando terei acesso?" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Resposta *</label>
                  <textarea value={f.answer} onChange={(e) => updateF(f.id, { answer: e.target.value })} rows={3} className={`${inputClass} resize-none`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // ── CTA ──
    case "cta": {
      const mode = block.ctaType ?? "course";
      return (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Título da seção</label>
            <input type="text" value={block.heading ?? ""} onChange={(e) => onUpdate({ heading: e.target.value })} placeholder="Pronto para começar?" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Subtítulo</label>
            <textarea value={block.text ?? ""} onChange={(e) => onUpdate({ text: e.target.value })} rows={2} placeholder="Uma frase motivadora..." className={`${inputClass} resize-none`} />
          </div>

          {/* Modo do botão */}
          <div>
            <label className={labelClass}>Modo do botão</label>
            <div className="flex gap-2 flex-wrap">
              {([
                { v: "course", label: "Automático (curso)" },
                { v: "url",    label: "Link personalizado" },
                { v: "whatsapp", label: "WhatsApp" },
              ] as const).map((opt) => (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => onUpdate({ ctaType: opt.v })}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    mode === opt.v
                      ? "bg-amber-400/20 text-amber-400"
                      : "border border-white/10 text-gray-500 hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Texto do botão (todos os modos) */}
          <div>
            <label className={labelClass}>Texto do botão</label>
            <input
              type="text"
              value={block.ctaButtonText ?? ""}
              onChange={(e) => onUpdate({ ctaButtonText: e.target.value })}
              placeholder={mode === "whatsapp" ? "Falar no WhatsApp" : mode === "url" ? "Saiba Mais" : "Comprar Agora (automático)"}
              className={inputClass}
            />
          </div>

          {/* Campos específicos por modo */}
          {mode === "url" && (
            <div>
              <label className={labelClass}>URL de destino *</label>
              <input
                type="text"
                value={block.ctaUrl ?? ""}
                onChange={(e) => onUpdate({ ctaUrl: e.target.value })}
                placeholder="https://... ou /pagina-interna"
                className={inputClass}
              />
              <p className="mt-1 text-[11px] text-gray-600">Links externos abrem em nova aba. Links internos (/...) navegam na mesma aba.</p>
            </div>
          )}

          {mode === "whatsapp" && (
            <>
              <div>
                <label className={labelClass}>Número do WhatsApp *</label>
                <input
                  type="text"
                  value={block.ctaWhatsappNumber ?? ""}
                  onChange={(e) => onUpdate({ ctaWhatsappNumber: e.target.value })}
                  placeholder="5511999999999"
                  className={inputClass}
                />
                <p className="mt-1 text-[11px] text-gray-600">Código do país + DDD + número, sem espaços ou traços.</p>
              </div>
              <div>
                <label className={labelClass}>Mensagem pré-definida</label>
                <textarea
                  value={block.ctaWhatsappMessage ?? ""}
                  onChange={(e) => onUpdate({ ctaWhatsappMessage: e.target.value })}
                  rows={3}
                  placeholder="Olá! Tenho interesse em..."
                  className={`${inputClass} resize-none`}
                />
              </div>
            </>
          )}

          {mode === "course" && (
            <p className="text-[11px] text-gray-600">O botão detecta automaticamente o estado do visitante: comprar, acessar ou WhatsApp do curso.</p>
          )}
        </div>
      );
    }

    // ── Columns ──
    case "columns": {
      const count = block.columnCount ?? 2;
      const cols = block.columns ?? [];

      function syncCount(newCount: 2 | 3) {
        const current = block.columns ?? [];
        let next: Column[];
        if (newCount > current.length) {
          next = [...current, ...Array.from({ length: newCount - current.length }, () => ({ id: uid(), imageUrl: "", heading: "", text: "", align: "left" as const }))];
        } else {
          next = current.slice(0, newCount);
        }
        onUpdate({ columnCount: newCount, columns: next });
      }

      function updateCol(id: string, patch: Partial<Column>) {
        onUpdate({ columns: cols.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
      }

      return (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Número de colunas</label>
            <div className="flex gap-2">
              {([2, 3] as const).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => syncCount(n)}
                  className={`rounded-lg px-5 py-2 text-sm font-bold transition-colors ${
                    count === n ? "bg-amber-400/20 text-amber-400" : "border border-white/10 text-gray-500 hover:text-white"
                  }`}
                >
                  {n} colunas
                </button>
              ))}
            </div>
          </div>

          {cols.map((col, i) => (
            <div key={col.id} className="rounded-xl border border-white/5 bg-white/[0.03] p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Coluna {i + 1}</p>
              <div>
                <label className={labelClass}>Imagem</label>
                <CloudinaryUpload value={col.imageUrl ?? ""} onChange={(url) => updateCol(col.id, { imageUrl: url })} />
              </div>
              <div>
                <label className={labelClass}>Título</label>
                <input
                  type="text"
                  value={col.heading ?? ""}
                  onChange={(e) => updateCol(col.id, { heading: e.target.value })}
                  placeholder="Título da coluna"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Texto</label>
                <textarea
                  value={col.text ?? ""}
                  onChange={(e) => updateCol(col.id, { text: e.target.value })}
                  rows={3}
                  placeholder="Descrição ou texto da coluna"
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className={labelClass}>Alinhamento</label>
                <AlignControl value={col.align} onChange={(v) => updateCol(col.id, { align: v })} />
              </div>
            </div>
          ))}
        </div>
      );
    }

    // ── Divider ──
    case "divider":
      return <p className="text-sm text-gray-500">Linha horizontal separadora. Sem configurações adicionais.</p>;

    // ── Spacer ──
    case "spacer":
      return (
        <div>
          <label className={labelClass}>Tamanho</label>
          <div className="flex gap-2">
            {(["sm", "md", "lg"] as const).map((s) => (
              <button key={s} type="button" onClick={() => onUpdate({ size: s })}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                  block.size === s ? "bg-amber-400/20 text-amber-400" : "border border-white/10 text-gray-500 hover:text-white"
                }`}
              >
                {s === "sm" ? "Pequeno" : s === "md" ? "Médio" : "Grande"}
              </button>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
}

// ── Block card ────────────────────────────────────────────────

function BlockCard({
  block,
  index,
  total,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  block: Block;
  index: number;
  total: number;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (patch: Partial<Block>) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className={`overflow-hidden rounded-2xl border transition-colors ${isExpanded ? "border-amber-400/20" : "border-white/5"} bg-white/[0.02]`}>
      {/* Header row */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Drag hint */}
        <div className="flex flex-col gap-0.5 text-gray-700">
          <div className="h-0.5 w-4 rounded bg-current" />
          <div className="h-0.5 w-4 rounded bg-current" />
          <div className="h-0.5 w-4 rounded bg-current" />
        </div>

        {/* Type badge */}
        <span className="flex-shrink-0 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-400">
          {TYPE_LABEL[block.type]}
        </span>

        {/* Preview text */}
        <p className="flex-1 truncate text-xs text-gray-500">
          {block.text ?? block.heading ?? block.url ?? ""}
        </p>

        {/* Visibility toggle */}
        <button
          type="button"
          onClick={() => onUpdate({ visible: !block.visible })}
          title={block.visible ? "Ocultar" : "Mostrar"}
          className={`text-sm transition-colors ${block.visible ? "text-amber-400" : "text-gray-700 hover:text-gray-400"}`}
        >
          {block.visible ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
          )}
        </button>

        {/* Up / Down */}
        <button type="button" onClick={onMoveUp} disabled={index === 0} className="text-gray-600 hover:text-white disabled:opacity-20">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
        </button>
        <button type="button" onClick={onMoveDown} disabled={index === total - 1} className="text-gray-600 hover:text-white disabled:opacity-20">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>

        {/* Edit toggle */}
        <button
          type="button"
          onClick={onToggle}
          className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${isExpanded ? "bg-amber-400/20 text-amber-400" : "border border-white/10 text-gray-500 hover:text-white"}`}
        >
          {isExpanded ? "Fechar" : "Editar"}
        </button>

        {/* Delete */}
        <button type="button" onClick={onDelete} className="text-gray-700 hover:text-red-400 transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Edit form */}
      {isExpanded && (
        <div className="border-t border-white/5 px-4 py-5">
          <BlockEditForm block={block} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
}

// ── Block picker ──────────────────────────────────────────────

function BlockPicker({ onSelect }: { onSelect: (type: BlockType) => void }) {
  return (
    <div className="rounded-2xl border border-amber-400/20 bg-[#0d0d16] p-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-amber-400/60">
        Escolha o tipo de bloco
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {BLOCK_DEFS.map((def) => (
          <button
            key={def.type}
            type="button"
            onClick={() => onSelect(def.type)}
            className="flex flex-col gap-1 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3 text-left transition-colors hover:border-amber-400/20 hover:bg-amber-400/[0.04]"
          >
            <span className="text-xs font-semibold text-white">{def.label}</span>
            <span className="text-[10px] text-gray-600">{def.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main builder ──────────────────────────────────────────────

export function LandingPageBuilder({
  blocks,
  onChange,
}: {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  function addBlock(type: BlockType) {
    const def = BLOCK_DEFS.find((d) => d.type === type)!;
    const newBlock: Block = {
      id: uid(),
      type,
      visible: true,
      ...def.defaults,
    };
    if (type === "columns") {
      const count = (newBlock.columnCount ?? 2) as number;
      newBlock.columns = Array.from({ length: count }, () => ({ id: uid(), imageUrl: "", heading: "", text: "", align: "left" as const }));
    }
    onChange([...blocks, newBlock]);
    setExpandedId(newBlock.id);
    setShowPicker(false);
  }

  function updateBlock(id: string, patch: Partial<Block>) {
    onChange(blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }

  function removeBlock(id: string) {
    onChange(blocks.filter((b) => b.id !== id));
    if (expandedId === id) setExpandedId(null);
  }

  function moveUp(id: string) {
    const i = blocks.findIndex((b) => b.id === id);
    if (i <= 0) return;
    const next = [...blocks];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    onChange(next);
  }

  function moveDown(id: string) {
    const i = blocks.findIndex((b) => b.id === id);
    if (i >= blocks.length - 1) return;
    const next = [...blocks];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {/* Empty state */}
      {blocks.length === 0 && !showPicker && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-12 text-center">
          <p className="text-sm text-gray-500">Nenhum bloco adicionado ainda.</p>
          <p className="mt-1 text-xs text-gray-600">Clique em &ldquo;Adicionar Bloco&rdquo; para começar a construir a landing page.</p>
        </div>
      )}

      {/* Block list */}
      {blocks.map((block, i) => (
        <BlockCard
          key={block.id}
          block={block}
          index={i}
          total={blocks.length}
          isExpanded={expandedId === block.id}
          onToggle={() => setExpandedId(expandedId === block.id ? null : block.id)}
          onUpdate={(patch) => updateBlock(block.id, patch)}
          onDelete={() => removeBlock(block.id)}
          onMoveUp={() => moveUp(block.id)}
          onMoveDown={() => moveDown(block.id)}
        />
      ))}

      {/* Picker */}
      {showPicker && <BlockPicker onSelect={addBlock} />}

      {/* Add button */}
      <button
        type="button"
        onClick={() => setShowPicker((v) => !v)}
        className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
          showPicker
            ? "border-amber-400/30 bg-amber-400/5 text-amber-400"
            : "border-dashed border-white/10 text-gray-500 hover:border-white/20 hover:text-white"
        }`}
      >
        <svg className={`h-4 w-4 transition-transform ${showPicker ? "rotate-45" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        {showPicker ? "Cancelar" : "Adicionar Bloco"}
      </button>
    </div>
  );
}
