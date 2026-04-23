"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CloudinaryUpload } from "@/components/ui/CloudinaryUpload";
import type { LandingPageConfig, Testimonial, FaqItem } from "@/types/landing-page";

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

// ── Helpers ──────────────────────────────────────────
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

// ── Main component ────────────────────────────────────
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

  // Landing page config state
  const defLp = defaultValues.landingPageConfig ?? {};
  const [heroVideoUrl, setHeroVideoUrl] = useState(defLp.heroVideoUrl ?? "");
  const [heroSubtitle, setHeroSubtitle] = useState(defLp.heroSubtitle ?? "");
  const [showTrustBar, setShowTrustBar] = useState(defLp.showTrustBar !== false);
  const [showTestimonials, setShowTestimonials] = useState(defLp.showTestimonials ?? false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defLp.testimonials ?? []);
  const [showAboutMaster, setShowAboutMaster] = useState(defLp.showAboutMaster !== false);
  const [aboutMasterText, setAboutMasterText] = useState(defLp.aboutMasterText ?? "");
  const [showFaq, setShowFaq] = useState(defLp.showFaq ?? false);
  const [faq, setFaq] = useState<FaqItem[]>(defLp.faq ?? []);
  const [showFloatingCta, setShowFloatingCta] = useState(defLp.showFloatingCta !== false);

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
      heroVideoUrl: heroVideoUrl || undefined,
      heroSubtitle: heroSubtitle || undefined,
      showTrustBar,
      showTestimonials,
      testimonials: testimonials.length > 0 ? testimonials : undefined,
      showAboutMaster,
      aboutMasterText: aboutMasterText || undefined,
      showFaq,
      faq: faq.length > 0 ? faq : undefined,
      showFloatingCta,
    };
    formData.set("landingPageConfig", JSON.stringify(lp));

    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) setError(result.error);
    });
  }

  // Testimonial helpers
  function addTestimonial() {
    setTestimonials((prev) => [
      ...prev,
      { id: Date.now().toString(), name: "", role: "", text: "", rating: 5 },
    ]);
  }
  function updateTestimonial(id: string, field: keyof Testimonial, value: string | number) {
    setTestimonials((prev) => prev.map((t) => t.id === id ? { ...t, [field]: value } : t));
  }
  function removeTestimonial(id: string) {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  }

  // FAQ helpers
  function addFaq() {
    setFaq((prev) => [...prev, { id: Date.now().toString(), question: "", answer: "" }]);
  }
  function updateFaq(id: string, field: "question" | "answer", value: string) {
    setFaq((prev) => prev.map((f) => f.id === id ? { ...f, [field]: value } : f));
  }
  function removeFaq(id: string) {
    setFaq((prev) => prev.filter((f) => f.id !== id));
  }

  const inputClass = "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/20";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400";

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
          Configure as seções da página de vendas do curso.
        </p>

        <div className="space-y-8">

          {/* Hero */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-400/60">Hero</p>

            <div>
              <label className={labelClass}>Vídeo de Apresentação (Hero)</label>
              <input
                type="text"
                value={heroVideoUrl}
                onChange={(e) => setHeroVideoUrl(e.target.value)}
                placeholder="https://youtu.be/... ou https://vimeo.com/..."
                className={inputClass}
              />
              <p className="mt-1.5 text-[11px] text-gray-600">
                Exibe um vídeo 16:9 no hero ao invés da capa estática. Aceita YouTube e Vimeo.
              </p>
            </div>

            <div>
              <label className={labelClass}>Subtítulo do Hero</label>
              <textarea
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                rows={2}
                placeholder="Uma frase impactante sobre o curso. Se vazio, usa a primeira linha da descrição."
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          {/* Seções — toggles */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 space-y-3">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-amber-400/60">Seções Visíveis</p>
            <Toggle label="Barra de Confiança" desc="Ícones: Pagamento Seguro, Garantia 7 Dias, Acesso Imediato, Acesso Vitalício" checked={showTrustBar} onChange={setShowTrustBar} />
            <Toggle label="Depoimentos" desc="Cards com foto, nome e depoimento de alunos" checked={showTestimonials} onChange={setShowTestimonials} />
            <Toggle label="Sobre o Mestre" desc="Bio do Mestre Liu Artur para reforçar autoridade" checked={showAboutMaster} onChange={setShowAboutMaster} />
            <Toggle label="FAQ" desc="Perguntas e respostas para quebrar objeções" checked={showFaq} onChange={setShowFaq} />
            <Toggle label="CTA Flutuante" desc="Barra inferior que aparece ao rolar a página" checked={showFloatingCta} onChange={setShowFloatingCta} />
          </div>

          {/* Sobre o Mestre — texto customizado */}
          {showAboutMaster && (
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-amber-400/60">Bio — Sobre o Mestre</p>
              <textarea
                value={aboutMasterText}
                onChange={(e) => setAboutMasterText(e.target.value)}
                rows={5}
                placeholder="Bio customizada para este curso. Se vazio, exibe o texto padrão do Mestre."
                className={`${inputClass} resize-none leading-relaxed`}
              />
            </div>
          )}

          {/* Depoimentos */}
          {showTestimonials && (
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-400/60">Depoimentos</p>
                <button
                  type="button"
                  onClick={addTestimonial}
                  className="flex items-center gap-1.5 rounded-lg border border-amber-400/30 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:border-amber-400/60"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Adicionar
                </button>
              </div>

              {testimonials.length === 0 && (
                <p className="py-6 text-center text-xs text-gray-600">
                  Nenhum depoimento adicionado. Clique em &ldquo;Adicionar&rdquo; para começar.
                </p>
              )}

              <div className="space-y-4">
                {testimonials.map((t, i) => (
                  <div key={t.id} className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">Depoimento {i + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeTestimonial(t.id)}
                        className="text-xs text-red-500/60 hover:text-red-400"
                      >
                        Remover
                      </button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className={labelClass}>Nome *</label>
                        <input
                          type="text"
                          value={t.name}
                          onChange={(e) => updateTestimonial(t.id, "name", e.target.value)}
                          placeholder="Maria Silva"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Cargo / Localização</label>
                        <input
                          type="text"
                          value={t.role ?? ""}
                          onChange={(e) => updateTestimonial(t.id, "role", e.target.value)}
                          placeholder="Aluna, São Paulo"
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className={labelClass}>Foto (URL)</label>
                      <input
                        type="text"
                        value={t.photo ?? ""}
                        onChange={(e) => updateTestimonial(t.id, "photo", e.target.value)}
                        placeholder="https://..."
                        className={inputClass}
                      />
                    </div>
                    <div className="mt-3">
                      <label className={labelClass}>Depoimento *</label>
                      <textarea
                        value={t.text}
                        onChange={(e) => updateTestimonial(t.id, "text", e.target.value)}
                        rows={3}
                        placeholder="O que o aluno escreveu sobre o curso..."
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                    <div className="mt-3">
                      <label className={labelClass}>Avaliação (estrelas)</label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => updateTestimonial(t.id, "rating", star)}
                            className={`h-7 w-7 transition-colors ${(t.rating ?? 5) >= star ? "text-amber-400" : "text-gray-700"}`}
                          >
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        ))}
                        <span className="text-xs text-gray-500">{t.rating ?? 5}/5</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ */}
          {showFaq && (
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-400/60">Perguntas Frequentes (FAQ)</p>
                <button
                  type="button"
                  onClick={addFaq}
                  className="flex items-center gap-1.5 rounded-lg border border-amber-400/30 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:border-amber-400/60"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Adicionar
                </button>
              </div>

              {faq.length === 0 && (
                <p className="py-6 text-center text-xs text-gray-600">
                  Nenhuma pergunta adicionada. Clique em &ldquo;Adicionar&rdquo; para começar.
                </p>
              )}

              <div className="space-y-4">
                {faq.map((f, i) => (
                  <div key={f.id} className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">Pergunta {i + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeFaq(f.id)}
                        className="text-xs text-red-500/60 hover:text-red-400"
                      >
                        Remover
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className={labelClass}>Pergunta *</label>
                        <input
                          type="text"
                          value={f.question}
                          onChange={(e) => updateFaq(f.id, "question", e.target.value)}
                          placeholder="Ex: Quando terei acesso ao conteúdo?"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Resposta *</label>
                        <textarea
                          value={f.answer}
                          onChange={(e) => updateFaq(f.id, "answer", e.target.value)}
                          rows={3}
                          placeholder="Responda de forma clara e objetiva..."
                          className={`${inputClass} resize-none`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
