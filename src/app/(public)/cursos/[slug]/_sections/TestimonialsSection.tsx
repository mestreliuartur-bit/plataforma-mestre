import type { Testimonial } from "@/types/landing-page";

interface Props {
  testimonials: Testimonial[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < rating ? "text-amber-400" : "text-gray-700"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsSection({ testimonials }: Props) {
  if (!testimonials.length) return null;

  return (
    <section className="border-t border-white/5 py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-12">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-400/60">
            Depoimentos
          </p>
          <h2 className="font-serif text-3xl font-bold text-white">
            O que dizem os alunos
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            Histórias reais de transformação de quem já viveu esta jornada.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-6 transition-all hover:border-amber-400/10"
            >
              {/* Rating */}
              {t.rating && <StarRating rating={t.rating} />}

              {/* Quote */}
              <blockquote className="flex-1 text-sm leading-relaxed text-gray-300">
                &ldquo;{t.text}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                {t.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={t.photo}
                    alt={t.name}
                    className="h-10 w-10 flex-shrink-0 rounded-full object-cover ring-2 ring-white/10"
                  />
                ) : (
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-800 to-amber-900 text-sm font-bold text-white ring-2 ring-white/10">
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  {t.role && <p className="text-xs text-gray-500">{t.role}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
