"use client";

import { useState } from "react";
import { CldUploadWidget, CldImage } from "next-cloudinary";

interface CloudinaryUploadProps {
  value: string; // public_id atual
  onChange: (publicId: string) => void;
}

export function CloudinaryUpload({ value, onChange }: CloudinaryUploadProps) {
  const [isHovering, setIsHovering] = useState(false);

  const hasImage = Boolean(value);
  const isExternalUrl = value.startsWith("http");

  return (
    <div className="space-y-3">
      <CldUploadWidget
        // ── Upload assinado: não precisa de preset, mais seguro ──
        signatureEndpoint="/api/admin/upload"
        options={{
          // Identidade do cloud (sem o secret — seguro expor)
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,

          // Pasta destino
          folder: "mestre-liu-artur/events",

          // Formato e tamanho
          clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
          maxFileSize: 20_000_000, // 20MB — o Cloudinary comprime na nuvem

          // ── Compressão automática antes do upload ──
          // Redimensiona para no máximo 1200px de largura/altura
          maxImageWidth: 1200,
          maxImageHeight: 1200,
          // Qualidade: auto (Cloudinary escolhe o melhor balance)

          // Crop forçado em 9:16
          cropping: true,
          croppingAspectRatio: 0.5625, // 9 / 16
          showSkipCropButton: false,
          croppingCoordinatesMode: "face",

          multiple: false,
          maxFiles: 1,

          // Tema escuro do widget
          styles: {
            palette: {
              window: "#0a0a0f",
              windowBorder: "#1f1f2e",
              tabIcon: "#f59e0b",
              menuIcons: "#9ca3af",
              textDark: "#ffffff",
              textLight: "#0a0a0f",
              link: "#f59e0b",
              action: "#f59e0b",
              inactiveTabIcon: "#6b7280",
              error: "#ef4444",
              inProgress: "#f59e0b",
              complete: "#10b981",
              sourceBg: "#0f0f1a",
            },
          },
        }}
        onSuccess={(result) => {
          if (
            result.event === "success" &&
            result.info &&
            typeof result.info === "object"
          ) {
            const info = result.info as { public_id: string };
            onChange(info.public_id);
          }
        }}
        onError={(error) => {
          console.error("[Cloudinary Upload Error]", error);
        }}
      >
        {({ open }) => (
          <div className="flex gap-5">
            {/* ── Preview 9:16 ── */}
            <div
              className="relative flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-gray-900"
              style={{ width: 112, height: 200 }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={() => !hasImage && open()}
            >
              {hasImage ? (
                <>
                  {isExternalUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={value}
                      alt="Capa do evento"
                      className="h-full w-full object-cover"
                    />
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
                  )}

                  {/* Overlay "Trocar" ao hover */}
                  {isHovering && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); open(); }}
                        className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        Trocar
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* Placeholder */
                <div className="flex h-full flex-col items-center justify-center gap-2 p-3 text-center">
                  <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  <span className="text-[10px] leading-tight text-gray-600">Clique para<br/>fazer upload</span>
                </div>
              )}
            </div>

            {/* ── Botão + informações ── */}
            <div className="flex flex-col justify-center gap-3">
              <button
                type="button"
                onClick={() => open()}
                className="flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/5 px-4 py-3 text-sm font-medium text-amber-400 transition-all hover:border-amber-400/50 hover:bg-amber-400/10"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                {hasImage ? "Trocar imagem" : "Upload de imagem"}
              </button>

              <div className="space-y-1.5">
                <p className="text-xs text-gray-500">
                  Proporção <strong className="text-gray-300">9:16</strong> — pôster vertical
                </p>
                <p className="text-xs text-gray-600">
                  JPG, PNG, WebP · até 20MB
                </p>
                <p className="text-xs text-gray-600">
                  Imagens grandes são otimizadas automaticamente
                </p>
                {hasImage && !isExternalUrl && (
                  <p className="text-[11px] text-emerald-400/80">
                    ✓ Upload realizado
                  </p>
                )}
              </div>

              {hasImage && (
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
        )}
      </CldUploadWidget>
    </div>
  );
}
