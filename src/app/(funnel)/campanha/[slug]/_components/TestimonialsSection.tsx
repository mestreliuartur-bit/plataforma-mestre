interface Testimonial {
  name: string;
  role?: string;
  text: string;
  avatarUrl?: string;
  videoUrl?: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials.length) return null;

  return (
    <section className="relative bg-[#07070d] py-24">
      {/* Glow top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent"
      />

      <div className="mx-auto max-w-6xl px-6 lg:px-12">
        <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-widest text-amber-400/60">
          Resultados Reais
        </p>
        <h2 className="mb-14 text-center font-serif text-3xl font-bold text-white sm:text-4xl">
          Cases de Sucesso
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} />
          ))}
        </div>
      </div>

      {/* Glow bottom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent"
      />
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { name, role, text, avatarUrl, videoUrl } = testimonial;

  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-6 transition-all duration-300 hover:border-amber-400/20 hover:bg-white/[0.05]">
      {/* Aspas decorativas */}
      <svg
        className="h-6 w-6 flex-shrink-0 text-amber-400/30"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>

      {/* Vídeo inline */}
      {videoUrl && (
        <div className="aspect-video w-full overflow-hidden rounded-xl">
          <iframe
            src={videoUrl}
            title={`Depoimento de ${name}`}
            allowFullScreen
            loading="lazy"
            className="h-full w-full"
          />
        </div>
      )}

      {/* Texto */}
      <p className="flex-1 text-sm leading-relaxed text-gray-400">{text}</p>

      {/* Autor */}
      <div className="flex items-center gap-3 border-t border-white/5 pt-4">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={name}
            className="h-10 w-10 rounded-full object-cover ring-1 ring-amber-400/20"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/10 text-sm font-bold text-amber-400">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-white">{name}</p>
          {role && <p className="text-xs text-gray-600">{role}</p>}
        </div>
        {/* Stars */}
        <div className="ml-auto flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} className="h-3.5 w-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
    </div>
  );
}
