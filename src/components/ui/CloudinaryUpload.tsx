"use client";

import { useRef, useState } from "react";
import { CldImage } from "next-cloudinary";

interface CloudinaryUploadProps {
  value: string;
  onChange: (publicId: string) => void;
}

export function CloudinaryUpload({ value, onChange }: CloudinaryUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const hasImage = Boolean(value);
  const isExternalUrl = value.startsWith("http");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação básica no cliente
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowed.includes(file.type)) {
      setError("Formato inválido. Use JPG, PNG ou WebP.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("Arquivo muito grande. Máximo 20MB.");
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      // 1. Pede assinatura ao servidor
      const sigRes = await fetch("/api/admin/upload", { method: "POST" });
      if (!sigRes.ok) throw new Error("Falha ao gerar assinatura.");
      const { signature, timestamp, folder, apiKey, cloudName } = await sigRes.json();

      // 2. Monta o FormData para o Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      formData.append("folder", folder);

      // 3. Upload direto browser → Cloudinary com acompanhamento de progresso
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            onChange(data.public_id);
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
      setError(err instanceof Error ? err.message : "Erro inesperado no upload.");
    } finally {
      setUploading(false);
      setProgress(0);
      // Limpa o input para permitir re-upload do mesmo arquivo
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex gap-5">
      {/* Input file oculto */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {/* Preview 9:16 */}
      <div
        className="relative flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-gray-900"
        style={{ width: 112, height: 200 }}
      >
        {uploading ? (
          /* Barra de progresso */
          <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
              <div
                className="h-full rounded-full bg-amber-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[11px] font-semibold text-amber-400">{progress}%</span>
            <span className="text-[10px] text-gray-500">Enviando...</span>
          </div>
        ) : hasImage ? (
          isExternalUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Capa" className="h-full w-full object-cover" />
          ) : (
            <CldImage
              src={value}
              alt="Capa do evento"
              fill
              sizes="112px"
              crop="fill"
              gravity="auto"
              quality="auto"
              format="auto"
              className="object-cover"
            />
          )
        ) : (
          /* Placeholder */
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-full w-full flex-col items-center justify-center gap-2 p-3 text-center transition-colors hover:bg-white/5"
          >
            <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
            </svg>
            <span className="text-[10px] leading-tight text-gray-600">9:16</span>
          </button>
        )}
      </div>

      {/* Controles */}
      <div className="flex flex-col justify-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/5 px-4 py-3 text-sm font-medium text-amber-400 transition-all hover:border-amber-400/50 hover:bg-amber-400/10 disabled:opacity-50"
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
              {hasImage ? "Trocar imagem" : "Selecionar imagem"}
            </>
          )}
        </button>

        <div className="space-y-1">
          <p className="text-xs text-gray-500">
            Proporção <strong className="text-gray-300">9:16</strong> — pôster vertical
          </p>
          <p className="text-xs text-gray-600">JPG, PNG, WebP · até 20MB</p>
          {hasImage && !isExternalUrl && (
            <p className="text-[11px] text-emerald-400/80">✓ Upload realizado</p>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}

        {hasImage && !uploading && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-left text-xs text-red-400/60 transition-colors hover:text-red-400"
          >
            Remover imagem
          </button>
        )}
      </div>
    </div>
  );
}
