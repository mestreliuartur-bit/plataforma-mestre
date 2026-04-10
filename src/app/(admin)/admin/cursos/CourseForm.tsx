"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CloudinaryUpload } from "@/components/ui/CloudinaryUpload";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
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
  };
  submitLabel?: string;
}

export function CourseForm({ action, defaultValues = {}, submitLabel = "Criar Curso" }: CourseFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState(defaultValues.slug ?? "");
  const [isPublished, setIsPublished] = useState(defaultValues.isPublished ?? false);
  const [isWhatsappLead, setIsWhatsappLead] = useState(defaultValues.isWhatsappLead ?? false);
  const [coverImage, setCoverImage] = useState(defaultValues.coverImage ?? "");
  const [bannerImage, setBannerImage] = useState(defaultValues.bannerImage ?? "");

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

    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) setError(result.error);
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

      {/* ── Imagens ── */}
      <section>
        <h3 className="mb-4 flex items-center gap-2 font-serif text-base font-semibold text-white">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400/10 text-xs font-bold text-amber-400">1</span>
          Imagens do Curso
        </h3>
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

      {/* ── Informações Básicas ── */}
      <section>
        <h3 className="mb-4 flex items-center gap-2 font-serif text-base font-semibold text-white">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400/10 text-xs font-bold text-amber-400">2</span>
          Informações do Curso
        </h3>
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
              rows={6}
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

      {/* ── Acesso ── */}
      <section>
        <h3 className="mb-4 flex items-center gap-2 font-serif text-base font-semibold text-white">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400/10 text-xs font-bold text-amber-400">3</span>
          Acesso & Preço
        </h3>
        <div className="space-y-5">
          {/* Toggle WhatsApp Lead */}
          <div
            onClick={() => setIsWhatsappLead((v) => !v)}
            role="switch"
            aria-checked={isWhatsappLead}
            className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${
              isWhatsappLead ? "border-green-500/30 bg-green-500/5" : "border-white/5 bg-white/[0.02] hover:border-white/10"
            }`}
          >
            <div className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${isWhatsappLead ? "bg-green-500" : "bg-gray-700"}`}>
              <div className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${isWhatsappLead ? "translate-x-6" : "translate-x-1"}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Acesso via WhatsApp</p>
              <p className="text-xs text-gray-500">{isWhatsappLead ? "Preço oculto — cliente é direcionado ao WhatsApp" : "Preço exibido — acesso configurado manualmente"}</p>
            </div>
          </div>

          {isWhatsappLead && (
            <div>
              <label className={labelClass}>Número do WhatsApp</label>
              <input
                name="whatsappNumber"
                type="text"
                defaultValue={defaultValues.whatsappNumber}
                placeholder="5511999999999"
                className={inputClass}
              />
            </div>
          )}

          {!isWhatsappLead && (
            <div>
              <label className={labelClass}>Preço (R$)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">R$</span>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={defaultValues.price}
                  placeholder="297.00"
                  className={`${inputClass} pl-9`}
                />
              </div>
              <p className="mt-1.5 text-[11px] text-gray-600">Deixe em branco para curso gratuito</p>
            </div>
          )}

          {/* Toggle Publicado */}
          <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <label className="flex cursor-pointer items-center gap-3">
              <div
                onClick={() => setIsPublished((v) => !v)}
                role="switch"
                aria-checked={isPublished}
                className={`relative h-6 w-11 rounded-full transition-colors ${isPublished ? "bg-amber-500" : "bg-gray-700"}`}
              >
                <div className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${isPublished ? "translate-x-6" : "translate-x-1"}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{isPublished ? "Publicado" : "Rascunho"}</p>
                <p className="text-xs text-gray-500">{isPublished ? "Visível na área de cursos" : "Oculto do público"}</p>
              </div>
            </label>
          </div>
        </div>
      </section>

      {/* ── Botões ── */}
      <div className="flex items-center gap-4 border-t border-white/5 pt-6">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-3 text-sm font-semibold text-black disabled:opacity-60"
        >
          {isPending ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Salvando...
            </>
          ) : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/cursos")}
          className="rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-gray-400 transition-all hover:border-white/20 hover:text-white"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
