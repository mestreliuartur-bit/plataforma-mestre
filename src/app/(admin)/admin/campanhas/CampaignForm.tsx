"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/validations/event";
import { CloudinaryUpload } from "@/components/ui/CloudinaryUpload";

interface CampaignFormProps {
  action: (formData: FormData) => Promise<{ error?: string } | undefined>;
  defaultValues?: {
    slug?: string;
    isActive?: boolean;
    headline?: string;
    subtitle?: string;
    mediaType?: string;
    mediaUrl?: string;
    ctaLabel?: string;
    ctaUrl?: string;
    aboutImage?: string;
    aboutTitle?: string;
    aboutText?: string;
    testimonials?: string;
    metaTitle?: string;
    metaDescription?: string;
    pixelHead?: string;
    pixelBody?: string;
  };
  submitLabel?: string;
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/20";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400";

export function CampaignForm({
  action,
  defaultValues = {},
  submitLabel = "Criar Campanha",
}: CampaignFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [slug, setSlug] = useState(defaultValues.slug ?? "");
  const [isActive, setIsActive] = useState(defaultValues.isActive ?? true);
  const [mediaType, setMediaType] = useState(defaultValues.mediaType ?? "IMAGE");
  const [aboutImage, setAboutImage] = useState(defaultValues.aboutImage ?? "");

  function parseTestimonialsDefault() {
    if (!defaultValues.testimonials) return [{ name: "", role: "", text: "" }];
    try {
      const parsed = JSON.parse(defaultValues.testimonials);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed.map((t: Record<string, string>) => ({ name: t.name ?? "", role: t.role ?? "", text: t.text ?? "" }));
    } catch {}
    return [{ name: "", role: "", text: "" }];
  }

  const [testimonials, setTestimonials] = useState<{ name: string; role: string; text: string }[]>(parseTestimonialsDefault);

  function handleHeadlineChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!defaultValues.slug) setSlug(slugify(e.target.value));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("isActive", String(isActive));
    formData.set("mediaType", mediaType);
    formData.set("aboutImage", aboutImage);
    const filledTestimonials = testimonials.filter((t) => t.name.trim() || t.text.trim());
    formData.set("testimonials", filledTestimonials.length ? JSON.stringify(filledTestimonials) : "");

    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-10">
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
          <svg className="h-4 w-4 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* ── Seção 1: Hero ── */}
      <section>
        <SectionHeader index={1} title="Hero — Dobra Principal" />
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Headline (H1) *</label>
            <input
              name="headline"
              defaultValue={defaultValues.headline}
              onChange={handleHeadlineChange}
              required
              placeholder="Ex: Desvende os Segredos da Prosperidade Espiritual"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Slug (URL) *</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">/campanha/</span>
              <input
                name="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                placeholder="nome-da-campanha"
                className={inputClass}
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-600">
              Acesso público: /campanha/{slug || "..."}
            </p>
          </div>

          <div>
            <label className={labelClass}>Subtítulo / Texto de Apoio</label>
            <textarea
              name="subtitle"
              defaultValue={defaultValues.subtitle}
              rows={3}
              placeholder="Texto curto que reforça a promessa da headline..."
              className={inputClass}
            />
          </div>

          {/* Mídia */}
          <div>
            <label className={labelClass}>Tipo de Mídia</label>
            <div className="flex gap-3">
              {(["VIDEO", "IMAGE"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setMediaType(t)}
                  className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    mediaType === t
                      ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
                      : "border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20"
                  }`}
                >
                  {t === "VIDEO" ? "Vídeo (YouTube)" : "Imagem"}
                </button>
              ))}
            </div>
          </div>

          {mediaType === "VIDEO" ? (
            <div>
              <label className={labelClass}>URL do Vídeo (YouTube)</label>
              <input
                name="mediaUrl"
                defaultValue={defaultValues.mediaUrl}
                placeholder="https://www.youtube.com/watch?v=..."
                className={inputClass}
              />
            </div>
          ) : (
            <div>
              <label className={labelClass}>Imagem de Destaque</label>
              <CloudinaryUpload
                value={defaultValues.mediaUrl ?? ""}
                onChange={(url) => {
                  const input = formRef.current?.querySelector<HTMLInputElement>('[name="mediaUrl"]');
                  if (input) input.value = url;
                }}
              />
              <input type="hidden" name="mediaUrl" defaultValue={defaultValues.mediaUrl} />
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Texto do Botão (CTA) *</label>
              <input
                name="ctaLabel"
                defaultValue={defaultValues.ctaLabel ?? "Quero Participar Agora"}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>URL de Destino (CTA) *</label>
              <input
                name="ctaUrl"
                defaultValue={defaultValues.ctaUrl}
                required
                placeholder="https://checkout.exemplo.com ou wa.me/..."
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-white/5" />

      {/* ── Seção 2: Autoridade ── */}
      <section>
        <SectionHeader index={2} title="Autoridade — Quem é o Mestre?" />
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Foto do Mestre</label>
            <CloudinaryUpload value={aboutImage} onChange={setAboutImage} />
            <input type="hidden" name="aboutImage" value={aboutImage} />
          </div>

          <div>
            <label className={labelClass}>Título da Seção</label>
            <input
              name="aboutTitle"
              defaultValue={defaultValues.aboutTitle}
              placeholder="Quem é o Mestre Liu Artur?"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Biografia Magnética</label>
            <textarea
              name="aboutText"
              defaultValue={defaultValues.aboutText}
              rows={6}
              placeholder="Escreva a história e autoridade do Mestre. Separe parágrafos com linha em branco..."
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <div className="border-t border-white/5" />

      {/* ── Seção 3: Depoimentos ── */}
      <section>
        <SectionHeader index={3} title="Depoimentos" />
        <div className="space-y-4">
          {testimonials.map((t, i) => (
            <div key={i} className="relative rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400/70">Depoimento {i + 1}</span>
                {testimonials.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setTestimonials((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-xs text-red-400/70 hover:text-red-400 transition-colors"
                  >
                    Remover
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Nome *</label>
                  <input
                    value={t.name}
                    onChange={(e) => setTestimonials((prev) => prev.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))}
                    placeholder="Maria Clara"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Cargo / Função</label>
                  <input
                    value={t.role}
                    onChange={(e) => setTestimonials((prev) => prev.map((x, idx) => idx === i ? { ...x, role: e.target.value } : x))}
                    placeholder="Empresária"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Depoimento *</label>
                <textarea
                  value={t.text}
                  onChange={(e) => setTestimonials((prev) => prev.map((x, idx) => idx === i ? { ...x, text: e.target.value } : x))}
                  placeholder="Após participar do ritual, minha vida mudou completamente..."
                  rows={3}
                  className={inputClass}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setTestimonials((prev) => [...prev, { name: "", role: "", text: "" }])}
            className="w-full rounded-xl border border-dashed border-white/20 py-3 text-sm text-gray-400 hover:border-amber-400/40 hover:text-amber-400/70 transition-colors"
          >
            + Adicionar depoimento
          </button>
        </div>
      </section>

      <div className="border-t border-white/5" />

      {/* ── Seção 4: Rastreamento & Pixels ── */}
      <section>
        <SectionHeader index={4} title="Rastreamento & Pixels" />
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3">
          <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-xs text-amber-300/80">
            Apenas códigos de rastreamento válidos devem ser inseridos aqui. Eles serão renderizados diretamente na landing page sem nenhum filtro — cole somente snippets fornecidos por plataformas confiáveis (Facebook, Google, TikTok, etc.).
          </p>
        </div>
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Pixel — Código do &lt;head&gt;</label>
            <p className="mb-2 text-xs text-gray-500">Cole aqui o bloco <code className="text-amber-400/70">&lt;script&gt;...&lt;/script&gt;</code> fornecido pela plataforma de anúncios (Facebook Pixel base code, Google Tag Manager, TikTok Pixel, etc.)</p>
            <textarea
              name="pixelHead"
              defaultValue={defaultValues.pixelHead}
              rows={8}
              spellCheck={false}
              placeholder={`<!-- Exemplo: Facebook Pixel -->\n<script>\n  !function(f,b,e,v,n,t,s){...}(window, document,'script',\n  'https://connect.facebook.net/en_US/fbevents.js');\n  fbq('init', 'SEU_PIXEL_ID');\n  fbq('track', 'PageView');\n</script>`}
              className={`${inputClass} font-mono text-xs`}
            />
          </div>
          <div>
            <label className={labelClass}>Pixel — Código do &lt;body&gt; (noscript)</label>
            <p className="mb-2 text-xs text-gray-500">Cole aqui a tag <code className="text-amber-400/70">&lt;noscript&gt;...&lt;/noscript&gt;</code> que fica logo após a abertura do body (usada como fallback quando JavaScript está desabilitado).</p>
            <textarea
              name="pixelBody"
              defaultValue={defaultValues.pixelBody}
              rows={5}
              spellCheck={false}
              placeholder={`<!-- Exemplo: Facebook Pixel noscript -->\n<noscript>\n  <img height="1" width="1" style="display:none"\n    src="https://www.facebook.com/tr?id=SEU_PIXEL_ID&ev=PageView&noscript=1"/>\n</noscript>`}
              className={`${inputClass} font-mono text-xs`}
            />
          </div>
        </div>
      </section>

      <div className="border-t border-white/5" />

      {/* ── Seção 5: SEO + Status ── */}
      <section>
        <SectionHeader index={5} title="SEO & Configurações" />
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Meta Title (SEO)</label>
              <input
                name="metaTitle"
                defaultValue={defaultValues.metaTitle}
                placeholder="Título para o Google (max 70 chars)"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Meta Description (SEO)</label>
              <input
                name="metaDescription"
                defaultValue={defaultValues.metaDescription}
                placeholder="Descrição para o Google (max 160 chars)"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-white">Campanha Ativa</p>
              <p className="text-xs text-gray-500">Desative para tirar do ar sem deletar</p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isActive ? "bg-amber-400" : "bg-white/10"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* ── Submit ── */}
      <div className="flex items-center justify-between border-t border-white/5 pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-gray-500 transition hover:text-gray-300"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-amber-400 px-8 py-3 text-sm font-bold text-black transition hover:bg-amber-300 disabled:opacity-50"
        >
          {isPending && (
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function SectionHeader({ index, title }: { index: number; title: string }) {
  return (
    <h3 className="mb-6 flex items-center gap-3 font-serif text-base font-semibold text-white">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400/10 text-xs font-bold text-amber-400">
        {index}
      </span>
      {title}
    </h3>
  );
}
