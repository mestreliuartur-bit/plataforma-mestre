const DEFAULT_BIO = `Com mais de duas décadas dedicadas ao estudo e à prática das ciências esotéricas e das tradições espirituais brasileiras, o Mestre Liu Artur é reconhecido pela profundidade de seu conhecimento e pela capacidade de transformar vidas através do ensino espiritual.

Iniciado nas tradições de Umbanda e com vasta experiência em Magia, Astrologia e Espiritualidade, o Mestre já guiou centenas de alunos em sua jornada de autoconhecimento, oferecendo um caminho seguro, fundamentado e repleto de sabedoria ancestral.

Seu método une o rigor do conhecimento tradicional com uma linguagem acessível e contemporânea, permitindo que estudantes de todos os níveis encontrem crescimento espiritual genuíno e duradouro.`;

interface Props {
  customText?: string;
  masterPhoto?: string;
}

function resolveCloudinaryUrl(url: string) {
  if (!url) return url;
  if (url.startsWith("http")) return url;
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_400,h_400,q_auto,f_auto/${url}`;
}

export function AboutMasterSection({ customText, masterPhoto }: Props) {
  const bio = customText || DEFAULT_BIO;
  const photoUrl = masterPhoto ? resolveCloudinaryUrl(masterPhoto) : null;

  return (
    <section className="border-t border-white/5 py-20">
      <div className="mx-auto max-w-5xl px-6 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[280px_1fr] lg:items-center">
          {/* Foto */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <div className="absolute -inset-3 rounded-full bg-amber-400/10 blur-2xl" />
              <div className="relative flex h-52 w-52 items-center justify-center overflow-hidden rounded-full border-2 border-amber-400/20 bg-gradient-to-br from-purple-950 via-zinc-900 to-zinc-950 shadow-2xl shadow-black/60 ring-4 ring-white/5">
                {photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoUrl}
                    alt="Mestre Liu Artur"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <svg viewBox="0 0 100 100" className="h-24 w-24 text-amber-400/20" fill="currentColor">
                    <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
                  </svg>
                )}
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-amber-400/30 bg-[#0a0a0f] px-4 py-1 text-xs font-semibold text-amber-400">
                Mestre Liu Artur
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-400/60">
              Sobre o Mestre
            </p>
            <h2 className="mb-6 font-serif text-3xl font-bold text-white">
              Quem vai te guiar nesta jornada
            </h2>

            <div className="space-y-4">
              {bio.split("\n\n").map((paragraph, i) => (
                <p key={i} className="leading-relaxed text-gray-400">
                  {paragraph.trim()}
                </p>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/5 pt-8">
              {[
                { value: "20+", label: "Anos de prática" },
                { value: "500+", label: "Alunos formados" },
                { value: "100%", label: "Dedicação espiritual" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-serif text-2xl font-bold text-amber-400">{s.value}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
