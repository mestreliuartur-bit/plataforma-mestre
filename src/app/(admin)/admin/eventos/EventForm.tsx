"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/validations/event";
import { CloudinaryUpload } from "@/components/ui/CloudinaryUpload";

interface EventFormProps {
  action: (formData: FormData) => Promise<{ error?: string } | undefined>;
  defaultValues?: {
    title?: string;
    slug?: string;
    description?: string;
    price?: string;
    coverImage?: string;
    type?: string;
    isActive?: boolean;
    isPublished?: boolean;
    isWhatsappLead?: boolean;
    whatsappNumber?: string;
    whatsappMessage?: string;
    maxSlots?: string;
    eventDate?: string;
    location?: string;
  };
  submitLabel?: string;
}

export function EventForm({ action, defaultValues = {}, submitLabel = "Criar Evento" }: EventFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState(defaultValues.slug ?? "");
  const [type, setType] = useState(defaultValues.type ?? "DISTANCIA");
  const [isPublished, setIsPublished] = useState(defaultValues.isPublished ?? false);
  const [isActive, setIsActive] = useState(defaultValues.isActive ?? true);
  const [isWhatsappLead, setIsWhatsappLead] = useState(defaultValues.isWhatsappLead ?? false);
  const [coverImage, setCoverImage] = useState(defaultValues.coverImage ?? "");

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!defaultValues.slug) {
      setSlug(slugify(e.target.value));
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("isActive", String(isActive));
    formData.set("isPublished", String(isPublished));
    formData.set("isWhatsappLead", String(isWhatsappLead));
    formData.set("coverImage", coverImage);

    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/20";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
          <svg className="h-4 w-4 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* ── Imagem de Capa (9:16) ── */}
      <section>
        <h3 className="mb-4 flex items-center gap-2 font-serif text-base font-semibold text-white">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400/10 text-xs font-bold text-amber-400">1</span>
          Imagem de Capa
        </h3>
        <CloudinaryUpload value={coverImage} onChange={setCoverImage} />
        {/* hidden field para o Server Action */}
        <input type="hidden" name="coverImage" value={coverImage} />
      </section>

      <div className="border-t border-white/5" />

      {/* ── Informações Básicas ── */}
      <section>
        <h3 className="mb-4 flex items-center gap-2 font-serif text-base font-semibold text-white">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400/10 text-xs font-bold text-amber-400">2</span>
          Informações Básicas
        </h3>

        <div className="space-y-5">
          {/* Título + Slug */}
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <label className={labelClass}>Título *</label>
              <input
                name="title"
                type="text"
                required
                defaultValue={defaultValues.title}
                onChange={handleTitleChange}
                placeholder="Ex: Ritual de Prosperidade Financeira"
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
                placeholder="ritual-prosperidade-financeira"
                className={inputClass}
              />
              <p className="mt-1.5 text-[11px] text-gray-600">/eventos/{slug || "..."}</p>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className={labelClass}>Descrição *</label>
            <textarea
              name="description"
              required
              defaultValue={defaultValues.description}
              rows={7}
              placeholder="Descreva detalhadamente o evento: o que o participante irá receber, os benefícios, o que está incluso..."
              className={`${inputClass} resize-none leading-relaxed`}
            />
            <p className="mt-1.5 text-[11px] text-gray-600">
              Use parágrafos para organizar o texto. Integração com editor Rich Text (TipTap) pode ser adicionada aqui.
            </p>
          </div>
        </div>
      </section>

      <div className="border-t border-white/5" />

      {/* ── Configurações ── */}
      <section>
        <h3 className="mb-4 flex items-center gap-2 font-serif text-base font-semibold text-white">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400/10 text-xs font-bold text-amber-400">3</span>
          Configurações
        </h3>

        <div className="space-y-5">
          {/* Toggle WhatsApp Lead */}
          <div
            onClick={() => setIsWhatsappLead((v) => !v)}
            role="switch"
            aria-checked={isWhatsappLead}
            className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${
              isWhatsappLead
                ? "border-green-500/30 bg-green-500/5"
                : "border-white/5 bg-white/[0.02] hover:border-white/10"
            }`}
          >
            <div className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
              isWhatsappLead ? "bg-green-500" : "bg-gray-700"
            }`}>
              <div className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                isWhatsappLead ? "translate-x-6" : "translate-x-1"
              }`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Venda via WhatsApp</p>
              <p className="text-xs text-gray-500">
                {isWhatsappLead
                  ? "Preço oculto — cliente é direcionado ao WhatsApp"
                  : "Preço exibido — venda direta na plataforma"}
              </p>
            </div>
            {isWhatsappLead && (
              <span className="ml-auto flex items-center gap-1.5 rounded-full bg-green-500/20 px-2.5 py-1 text-[10px] font-bold text-green-400">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </span>
            )}
          </div>

          {/* Campos de WhatsApp — aparecem quando isWhatsappLead */}
          {isWhatsappLead && (
            <div className="space-y-4 rounded-xl border border-green-500/20 bg-green-500/5 p-5">
              <div>
                <label className={labelClass}>Número do WhatsApp *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-gray-500">+</span>
                  <input
                    name="whatsappNumber"
                    type="text"
                    defaultValue={defaultValues.whatsappNumber}
                    placeholder="5511910998013"
                    className={`${inputClass} pl-7`}
                  />
                </div>
                <p className="mt-1 text-[11px] text-gray-600">Formato internacional sem + ou espaços: 5511999999999</p>
              </div>
              <div>
                <label className={labelClass}>Mensagem Pré-definida</label>
                <textarea
                  name="whatsappMessage"
                  defaultValue={defaultValues.whatsappMessage}
                  rows={3}
                  placeholder="Olá! Tenho interesse no ritual [Nome do Ritual]. Pode me passar mais informações?"
                  className={`${inputClass} resize-none`}
                />
                <p className="mt-1 text-[11px] text-gray-600">Será enviada como texto inicial na conversa do WhatsApp.</p>
              </div>
            </div>
          )}

          {/* Preço + Tipo + Vagas — preço oculto quando isWhatsappLead */}
          <div className={`grid gap-5 ${isWhatsappLead ? "lg:grid-cols-2" : "lg:grid-cols-3"}`}>
            {!isWhatsappLead && (
              <div>
                <label className={labelClass}>Preço (R$) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">R$</span>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    required={!isWhatsappLead}
                    defaultValue={defaultValues.price}
                    placeholder="297.00"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>
            )}
            <div>
              <label className={labelClass}>Categoria *</label>
              <select
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={inputClass}
              >
                <option value="DISTANCIA">Ritual à Distância</option>
                <option value="PRESENCIAL">Evento Presencial</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Vagas (vazio = ilimitado)</label>
              <input
                name="maxSlots"
                type="number"
                min="1"
                defaultValue={defaultValues.maxSlots}
                placeholder="Ex: 12"
                className={inputClass}
              />
            </div>
          </div>

          {/* Data + Local — condicional ao tipo Presencial */}
          {type === "PRESENCIAL" && (
            <div className="grid gap-5 lg:grid-cols-2">
              <div>
                <label className={labelClass}>Data do Evento</label>
                <input
                  name="eventDate"
                  type="datetime-local"
                  defaultValue={defaultValues.eventDate}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Localização</label>
                <input
                  name="location"
                  type="text"
                  defaultValue={defaultValues.location}
                  placeholder="Rua das Acácias, 144 — São Paulo/SP"
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* Toggles */}
          <div className="flex flex-wrap gap-8 rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <label className="flex cursor-pointer items-center gap-3">
              <div
                onClick={() => setIsPublished((v) => !v)}
                role="switch"
                aria-checked={isPublished}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  isPublished ? "bg-amber-500" : "bg-gray-700"
                }`}
              >
                <div className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  isPublished ? "translate-x-6" : "translate-x-1"
                }`} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {isPublished ? "Publicado" : "Rascunho"}
                </p>
                <p className="text-xs text-gray-500">
                  {isPublished ? "Visível na homepage e para compra" : "Oculto do público"}
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-center gap-3">
              <div
                onClick={() => setIsActive((v) => !v)}
                role="switch"
                aria-checked={isActive}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  isActive ? "bg-emerald-600" : "bg-gray-700"
                }`}
              >
                <div className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  isActive ? "translate-x-6" : "translate-x-1"
                }`} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {isActive ? "Ativo" : "Inativo"}
                </p>
                <p className="text-xs text-gray-500">
                  {isActive ? "Aceita novas compras" : "Bloqueado para vendas"}
                </p>
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
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-3 text-sm font-semibold text-black transition-all hover:shadow-lg hover:shadow-amber-900/30 disabled:opacity-60"
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
          onClick={() => router.push("/admin/eventos")}
          className="rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-gray-400 transition-all hover:border-white/20 hover:text-white"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
