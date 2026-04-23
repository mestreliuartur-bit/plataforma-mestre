"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CloudinaryUpload } from "@/components/ui/CloudinaryUpload";
import type { LandingPageConfig, Block } from "@/types/landing-page";
import { LandingPageBuilder } from "./LandingPageBuilder";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const CATEGORIES = [
  { value: "UMBANDA", label: "Umbanda" },
  { value: "MAGIA", label: "Magia" },
  { value: "ESPIRITUALIDADE", label: "Espiritualidade" },
  { value: "RITUAIS", label: "Rituais" },
  { value: "MEDITACAO", label: "Meditação" },
  { value: "ASTROLOGIA", label: "Astrologia" },
  { value: "TAROT", label: "Tarot" },
  { value: "OUTROS", label: "Outros" },
];

interface CourseFormProps {
  action: (formData: FormData) => Promise<{ error?: string } | undefined>;
  defaultValues?: {
    title?: string;
    slug?: string;
    description?: string;
    coverImage?: string;
    bannerImage?: string;
    category?: string;
    isPublished?: boolean;
    price?: string;
    isWhatsappLead?: boolean;
    whatsappNumber?: string;
    landingPageConfig?: LandingPageConfig;
  };
  submitLabel?: string;
}

function Toggle({
  label, desc, checked, onChange, color = "amber",
}: {
  label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void; color?: "amber" | "green";
}) {
  const bg = color === "green"
    ? (checked ? "bg-green-500" : "bg-gray-700")
    : (checked ? "bg-amber-500" : "bg-gray-700");
  return (
    <div
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${
        checked
          ? color === "green" ? "border-green-500/30 bg-green-500/5" : "border-amber-400/20 bg-amber-400/[0.04]"
          : "border-white/5 bg-white/[0.02] hover:border-white/10"
      }`}
    >
      <div className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${bg}`}>
        <div className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        {desc && <p className="text-xs text-gray-500">{desc}</p>}
      </div>
    </div>
  );
}

function SectionHeader({ n, title }: { n: number; title: string }) {
  return (
    <h3 className="mb-4 flex items-center gap-2 font-serif text-base font-semibold text-white">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400/10 text-xs font-bold text-amber-400">
        {n}
      </span>
      {title}
    </h3>
  );
}

export function CourseForm({ action, defaultValues = {}, submitLabel = "Criar Curso" }: CourseFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [slug, setSlug] = useState(defaultValues.slug ?? "");
  const [isPublished, setIsPublished] = useState(defaultValues.isPublished ?? false);
  const [isWhatsappLead, setIsWhatsappLead] = useState(defaultValues.isWhatsappLead ?? false);
  const [coverImage, setCoverImage] = useState(defaultValues.coverImage ?? "");
  const [bannerImage, setBannerImage] = useState(defaultValues.bannerImage ?? "");

  // Landing page
  const defLp = defaultValues.landingPageConfig ?? {};
  const [heroSubtitle, setHeroSubtitle] = useState(defLp.heroSubtitle ?? "");
  const [showFloatingCta, setShowFloatingCta] = useState(defLp.showFloatingCta !== false);
  const [blocks, setBlocks] = useState<Block[]>(defLp.blocks ?? []);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!defaultValues.slug) setSlug(slugify(e.target.value));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("isPublished", String(isPublished));
    formData.set("isWhatsappLead", String(isWhatsappLead));
    formData.set("coverImage", coverImage);
    formData.set("bannerImage", bannerImage);

    const lp: LandingPageConfig = {
      heroSubtitle: heroSubtitle || undefined,
      showFloatingCta,
      blocks,
    };
    formData.set("landingPageConfig", JSON.stringify(lp));

    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 3000);
      }
    });
  }

  const inputClass = "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/20";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
          <svg className="h-4 w-4 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* ── 1. Imagens ── */}
      <section>
        <SectionHeader n={1} title="Imagens do Curso" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label className={labelClass}>Capa 9:16 (Card vertical) *</label>
            <CloudinaryUpload value={coverImage} onChange={setCoverImage} />
            <p className="mt-1.5 text-[11px] text-gray-600">Proporção vertical — usada nos cards estilo Netflix</p>
          </div>
          <div>
            <label className={labelClass}>Banner 16:9 (Horizontal)</label>
            <CloudinaryUpload value={bannerImage} onChange={setBannerImage} />
            <p className="mt-1.5 text-[11px] text-gray-600">Proporção horizontal — usada em destaques e hero</p>
          </div>
        </div>
      </section>

      <div className="border-t border-white/5" />

      {/* ── 2. Informações Básicas ── */}
      <section>
        <SectionHeader n={2} title="Informações do Curso" />
        <div className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <label className={labelClass}>Título *</label>
              <input
                name="title"
                type="text"
                required
                defaultValue={defaultValues.title}
                onChange={handleTitleChange}
                placeholder="Ex: Fundamentos de Umbanda"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Slug (URL) *</label>
              <input
                name="slug"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="fundamentos-de-umbanda"
                className={inputClass}
              />
              <p className="mt-1.5 text-[11px] text-gray-600">/cursos/{slug || "..."}</p>
            </div>
          </div>

          <div>
            <label className={labelClass}>Descrição *</label>
            <textarea
              name="description"
              required
              defaultValue={defaultValues.description}
              rows={5}
              placeholder="Descreva o que o aluno irá aprender neste curso..."
              className={`${inputClass} resize-none leading-relaxed`}
            />
          </div>

          <div>
            <label className={labelClass}>Categoria *</label>
            <select name="category" defaultValue={defaultValues.category ?? "OUTROS"} className={inputClass}>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="border-t border-white/5" />

      {/* ── 3. Acesso & Preço ── */}
      <section>
        <SectionHeader n={3} title="Acesso & Preço" />
        <div className="space-y-5">
          <Toggle
            label="Acesso via WhatsApp"
            desc={isWhatsappLead ? "Preço oculto — cliente é direcionado ao WhatsApp" : "Preço exibido — acesso configurado manualmente"}
            checked={isWhatsappLead}
            onChange={setIsWhatsappLead}
            color="green"
          />

          {isWhatsappLead && (
            <div>
              <label className={labelClass}>Número do WhatsApp</label>
              <input name="whatsappNumber" type="text" defaultValue={defaultValues.whatsappNumber} placeholder="5511999999999" className={inputClass} />
            </div>
          )}

          {!isWhatsappLead && (
            <div>
              <label className={labelClass}>Preço (R$)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">R$</span>
                <input name="price" type="number" step="0.01" min="0" defaultValue={defaultValues.price} placeholder="297.00" className={`${inputClass} pl-9`} />
              </div>
              <p className="mt-1.5 text-[11px] text-gray-600">Deixe em branco para curso gratuito</p>
            </div>
          )}

          <Toggle
            label={isPublished ? "Publicado" : "Rascunho"}
            desc={isPublished ? "Visível no catálogo de cursos" : "Oculto do público"}
            checked={isPublished}
            onChange={setIsPublished}
          />
        </div>
      </section>

      <div className="border-t border-white/5" />

      {/* ── 4. Landing Page ── */}
      <section>
        <SectionHeader n={4} title="Landing Page" />
        <p className="mb-6 -mt-2 text-xs text-gray-600">
          Monte a página de vendas arrastando blocos. O hero (título, CTA, capa) é gerado automaticamente.
        </p>

        <div className="mb-6 space-y-4">
          <div>
            <label className={labelClass}>Subtítulo do Hero</label>
            <textarea
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              rows={2}
              placeholder="Frase de impacto exibida abaixo do título. Se vazio, usa a primeira linha da descrição."
              className={`${inputClass} resize-none`}
            />
          </div>
          <Toggle
            label="CTA Flutuante"
            desc="Barra de compra que aparece ao rolar a página"
            checked={showFloatingCta}
            onChange={setShowFloatingCta}
          />
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0a0a14] p-4">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-amber-400/60">Blocos de Conteúdo</p>
          <LandingPageBuilder blocks={blocks} onChange={setBlocks} />
        </div>
      </section>

      {/* ── Botões ── */}
      <div className="flex items-center gap-4 border-t border-white/5 pt-6">
        <button
          type="submit"
          disabled={isPending}
          className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all disabled:opacity-60 ${
            saved
              ? "bg-emerald-600 text-white"
              : "bg-gradient-to-r from-amber-500 to-amber-400 text-black"
          }`}
        >
          {isPending ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Salvando...
            </>
          ) : saved ? (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Salvo!
            </>
          ) : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/cursos")}
          className="rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-gray-400 transition-all hover:border-white/20 hover:text-white"
        >
          ← Voltar para Cursos
        </button>
      </div>
    </form>
  );
}
