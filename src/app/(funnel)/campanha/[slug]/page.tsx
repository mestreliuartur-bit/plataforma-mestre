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
  return {
    title: campaign.metaTitle ?? campaign.headline,
    description: campaign.metaDescription ?? campaign.subtitle ?? undefined,
    robots: { index: false, follow: false }, // páginas de funil não são indexadas
  };
}

export const dynamic = "force-dynamic";

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
