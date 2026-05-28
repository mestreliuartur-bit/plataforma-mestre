import Image from "next/image";

interface AuthoritySectionProps {
  aboutImage?: string | null;
  aboutTitle?: string | null;
  aboutText?: string | null;
}

export function AuthoritySection({
  aboutImage,
  aboutTitle,
  aboutText,
}: AuthoritySectionProps) {
  if (!aboutText && !aboutImage) return null;

  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const imgSrc = aboutImage
    ? aboutImage.startsWith("http")
      ? aboutImage
      : `https://res.cloudinary.com/${cloud}/image/upload/c_fill,ar_1:1,w_600,q_auto,f_auto/${aboutImage}`
    : null;

  return (
    <section className="relative overflow-hidden bg-[#0a0a0f] py-24">
      {/* Separador ornamental */}
      <div className="mb-16 flex items-center justify-center gap-4" aria-hidden>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-400/30" />
        <svg viewBox="0 0 100 100" className="h-8 w-8 text-amber-400/40" fill="currentColor">
          <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
        </svg>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-400/30" />
      </div>

      <div className="mx-auto max-w-5xl px-6 lg:px-12">
        <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-widest text-amber-400/60">
          Autoridade
        </p>
        <h2 className="mb-14 text-center font-serif text-3xl font-bold text-white sm:text-4xl">
          {aboutTitle ?? "Quem é o Mestre Liu Artur?"}
        </h2>

        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-16">
          {/* Foto */}
          {imgSrc && (
            <div className="flex-shrink-0">
              <div className="relative h-72 w-72 overflow-hidden rounded-2xl border border-amber-400/20 shadow-2xl shadow-black/60 lg:h-80 lg:w-80">
                <Image
                  src={imgSrc}
                  alt={aboutTitle ?? "Mestre Liu Artur"}
                  fill
                  className="object-cover"
                  sizes="320px"
                />
                {/* Gold overlay frame */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-amber-400/10" />
              </div>
            </div>
          )}

          {/* Texto */}
          <div className="flex-1">
            <div className="prose prose-invert prose-lg max-w-none">
              {aboutText?.split("\n\n").map((paragraph, i) => (
                <p
                  key={i}
                  className="leading-relaxed text-gray-300"
                  style={{ marginBottom: i < (aboutText?.split("\n\n").length ?? 0) - 1 ? "1.25rem" : 0 }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
