import { CtaButton } from "./CampaignHero";

interface FinalCTAProps {
  ctaLabel: string;
  ctaUrl: string;
}

export function FinalCTA({ ctaLabel, ctaUrl }: FinalCTAProps) {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0f] py-28">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-[100px]" />
      </div>

      {/* Ornamental top line */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <svg
          viewBox="0 0 100 100"
          className="mx-auto mb-8 h-10 w-10 text-amber-400/40"
          fill="currentColor"
          aria-hidden
        >
          <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
        </svg>

        <h2 className="font-serif text-3xl font-black text-white sm:text-4xl md:text-5xl">
          Esta pode ser a virada<br />
          <span className="text-amber-400">que você estava esperando.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-500">
          Não deixe essa oportunidade passar. Dê o primeiro passo agora e transforme
          sua jornada espiritual com a orientação do Mestre Liu Artur.
        </p>

        <div className="mt-12 flex flex-col items-center gap-4">
          <CtaButton label={ctaLabel} href={ctaUrl} />
          <p className="text-xs text-gray-700">
            Acesso seguro · Suporte dedicado · Satisfação garantida
          </p>
        </div>
      </div>
    </section>
  );
}
