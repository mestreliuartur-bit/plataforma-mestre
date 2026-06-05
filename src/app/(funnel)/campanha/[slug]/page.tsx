import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { CampaignHero } from "./_components/CampaignHero";
import { AuthoritySection } from "./_components/AuthoritySection";
import { TestimonialsSection } from "./_components/TestimonialsSection";
import { FinalCTA } from "./_components/FinalCTA";
import { PixelInjector } from "./_components/PixelInjector";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getCampaign(slug: string) {
  return db.campaignPage.findFirst({
    where: { slug, isActive: true },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getCampaign(slug);
  if (!campaign) return {};

  const title = campaign.metaTitle ?? campaign.headline;
  const description = campaign.metaDescription ?? campaign.subtitle ?? undefined;

  return {
    title,
    description,
    // OG tags: necessário para preview correto no WhatsApp, Facebook, etc.
    // metadataBase definido em layout.tsx resolve os paths relativos.
    openGraph: {
      title,
      description,
      type: "website",
      locale: "pt_BR",
      url: `/campanha/${slug}`,
    },
    // Canonical: evita penalidade de conteúdo duplicado se a página for acessada
    // por múltiplos paths (ex: com e sem www, com query strings, etc.)
    alternates: {
      canonical: `/campanha/${slug}`,
    },
    // robots: removido — páginas de campanha devem ser indexadas para SEO orgânico.
    // Se precisar bloquear uma campanha específica, adicione o campo noindex ao modelo.
  };
}

// ISR: cache de 5 minutos. O conteúdo da campanha raramente muda durante uma
// veiculação ativa de anúncios. Remove o custo de DB em cada request.
export const revalidate = 300;

export default async function CampaignPage({ params }: Props) {
  const { slug } = await params;
  const campaign = await getCampaign(slug);
  if (!campaign) notFound();

  const testimonials = Array.isArray(campaign.testimonials)
    ? (campaign.testimonials as unknown as Testimonial[])
    : [];

  return (
    <main className="bg-[#0a0a0f]">
      <PixelInjector pixelHead={campaign.pixelHead} pixelBody={campaign.pixelBody} />

      <CampaignHero
        headline={campaign.headline}
        subtitle={campaign.subtitle}
        mediaType={campaign.mediaType}
        mediaUrl={campaign.mediaUrl}
        ctaLabel={campaign.ctaLabel}
        ctaUrl={campaign.ctaUrl}
      />

      <AuthoritySection
        aboutImage={campaign.aboutImage}
        aboutTitle={campaign.aboutTitle}
        aboutText={campaign.aboutText}
      />

      <TestimonialsSection testimonials={testimonials} />

      <FinalCTA ctaLabel={campaign.ctaLabel} ctaUrl={campaign.ctaUrl} />
    </main>
  );
}

interface Testimonial {
  name: string;
  role?: string;
  text: string;
  avatarUrl?: string;
  videoUrl?: string;
}
