"use client";

import { useRef, useState, useTransition } from "react";
import { createBanner } from "./actions";

interface Event {
  id: string;
  title: string;
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/20";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400";

export function BannerForm({ events }: { events: Event[] }) {
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowed.includes(file.type)) {
      setUploadError("Formato inválido. Use JPG, PNG ou WebP.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setUploadError("Arquivo muito grande. Máximo 20MB.");
      return;
    }

    setUploadError(null);
    setUploading(true);
    setProgress(0);

    try {
      const sigRes = await fetch("/api/admin/upload", { method: "POST" });
      if (!sigRes.ok) throw new Error("Falha ao gerar assinatura.");
      const { signature, timestamp, folder, apiKey, cloudName } = await sigRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      formData.append("folder", folder);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            // Para banners usamos a URL completa retornada pelo Cloudinary
            setImageUrl(data.secure_url);
            resolve();
          } else {
            reject(new Error(`Erro no upload: ${xhr.status}`));
          }
        };
        xhr.onerror = () => reject(new Error("Falha na conexão com o Cloudinary."));
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
        xhr.send(formData);
      });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!imageUrl) {
      setUploadError("Faça o upload da imagem antes de salvar.");
      return;
    }
    const formData = new FormData(e.currentTarget);
    formData.set("imageUrl", imageUrl);

    startTransition(async () => {
      await createBanner(formData);
      setSuccess(true);
      setImageUrl("");
      formRef.current?.reset();
      setTimeout(() => setSuccess(false), 3000);
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {/* Upload de imagem */}
      <div>
        <label className={labelClass}>Imagem do Banner *</label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />

        {/* Preview 16:9 */}
        <div
          className="relative mb-3 w-full overflow-hidden rounded-xl border border-white/10 bg-gray-900"
          style={{ aspectRatio: "16/9" }}
        >
          {uploading ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6">
              <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-gray-800">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-amber-400">{progress}%</span>
              <span className="text-xs text-gray-500">Enviando...</span>
            </div>
          ) : imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-full w-full flex-col items-center justify-center gap-2 transition-colors hover:bg-white/5"
              style={{ minHeight: 120 }}
            >
              <svg className="h-10 w-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
              </svg>
              <span className="text-xs text-gray-600">Clique para selecionar — proporção 16:9</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/5 px-4 py-2 text-sm font-medium text-amber-400 transition-all hover:border-amber-400/50 hover:bg-amber-400/10 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Enviando {progress}%
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                {imageUrl ? "Trocar imagem" : "Selecionar imagem"}
              </>
            )}
          </button>
          {imageUrl && !uploading && (
            <>
              <span className="text-xs text-emerald-400">✓ Upload realizado</span>
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="text-xs text-red-400/60 transition-colors hover:text-red-400"
              >
                Remover
              </button>
            </>
          )}
        </div>
        {uploadError && <p className="mt-1.5 text-xs text-red-400">{uploadError}</p>}
        <p className="mt-1 text-[11px] text-gray-600">Resolução recomendada: 1600×900px · JPG, PNG, WebP · até 20MB</p>
      </div>

      <div>
        <label className={labelClass}>Título *</label>
        <input name="title" type="text" required placeholder="Ritual de Prosperidade" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Subtítulo</label>
        <input name="subtitle" type="text" placeholder="Descrição curta para o hero" className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Texto do Botão *</label>
          <input name="ctaLabel" type="text" required defaultValue="Conhecer Ritual" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>URL de Destino *</label>
          <input name="ctaUrl" type="text" required placeholder="/eventos/meu-evento" className={inputClass} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Vincular Evento</label>
          <select name="eventId" className={inputClass}>
            <option value="">Nenhum (URL manual)</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Ordem</label>
          <input name="order" type="number" min="0" defaultValue="0" className={inputClass} />
        </div>
      </div>

      {success && (
        <p className="rounded-xl bg-emerald-900/30 px-4 py-3 text-sm text-emerald-400">
          ✓ Banner adicionado com sucesso!
        </p>
      )}

      <button
        type="submit"
        disabled={isPending || uploading || !imageUrl}
        className="mt-2 w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 py-3 text-sm font-semibold text-black transition-all hover:shadow-lg hover:shadow-amber-900/30 disabled:opacity-50"
      >
        {isPending ? "Salvando..." : "Adicionar Banner"}
      </button>
    </form>
  );
}
