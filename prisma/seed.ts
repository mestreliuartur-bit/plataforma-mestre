import { PrismaClient, Role, EventType, PurchaseStatus } from "@prisma/client";
import { hash } from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // ── Admin ──────────────────────────────────────────────────────────
  const adminPassword = await hash("Admin@123456", 12);
  const admin = await db.user.upsert({
    where: { email: "admin@mestreliuartur.com.br" },
    update: {},
    create: {
      name: "Mestre Liu Artur",
      email: "admin@mestreliuartur.com.br",
      password: adminPassword,
      role: Role.ADMIN,
      phone: "(11) 99999-0001",
      birthDate: new Date("1975-03-21"),
    },
  });
  console.log(`✅ Admin: ${admin.email}`);

  // ── Usuário de teste ───────────────────────────────────────────────
  const userPassword = await hash("User@123456", 12);
  const testUser = await db.user.upsert({
    where: { email: "teste@email.com" },
    update: {},
    create: {
      name: "Ana Clara Ferreira",
      email: "teste@email.com",
      password: userPassword,
      role: Role.USER,
      phone: "(11) 98765-4321",
      birthDate: new Date("1995-07-15"),
    },
  });
  console.log(`✅ Usuário teste: ${testUser.email}`);

  // ── Eventos ────────────────────────────────────────────────────────
  const eventos = [
    {
      slug: "ritual-prosperidade-financeira",
      title: "Ritual de Prosperidade Financeira",
      description:
        "Um trabalho esotérico profundo para atrair abundância e prosperidade para sua vida financeira. Utilizando os princípios herméticos da manifestação, abriremos os caminhos da riqueza e do sucesso material. Inclui preparo de amuleto personalizado e meditação guiada.",
      price: 297.0,
      coverImage: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800",
      type: EventType.DISTANCIA,
      isActive: true,
      isPublished: true,
      maxSlots: null,
    },
    {
      slug: "encontro-presencial-energia-vital",
      title: "Encontro Presencial — Energia Vital",
      description:
        "Workshop presencial intensivo de um dia completo focado no despertar da energia vital. Técnicas de respiração, meditação profunda, limpeza energética e alinhamento dos chakras. Vagas extremamente limitadas para garantir atenção individual.",
      price: 497.0,
      coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
      type: EventType.PRESENCIAL,
      isActive: true,
      isPublished: true,
      maxSlots: 12,
      eventDate: new Date("2026-05-10T09:00:00"),
      location: "Rua das Acácias, 144 — São Paulo/SP",
    },
    {
      slug: "trabalho-de-amor-e-harmonizacao",
      title: "Trabalho de Amor e Harmonização",
      description:
        "Ritual específico para harmonização de relacionamentos amorosos. Através de uma combinação de magias brancas e trabalhos com entidades de luz, buscamos restaurar laços, atrair o amor verdadeiro e curar feridas emocionais do passado.",
      price: 397.0,
      coverImage: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800",
      type: EventType.DISTANCIA,
      isActive: true,
      isPublished: true,
      maxSlots: null,
    },
    {
      slug: "limpeza-espiritual-profunda",
      title: "Limpeza Espiritual Profunda",
      description:
        "Processo de descarrego e limpeza energética para remover bloqueios, energias negativas e influências indesejadas que possam estar impedindo seu progresso em todas as áreas da vida.",
      price: 197.0,
      coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
      type: EventType.DISTANCIA,
      isActive: true,
      isPublished: false,
      maxSlots: null,
    },
  ];

  for (const evento of eventos) {
    const created = await db.event.upsert({
      where: { slug: evento.slug },
      update: {},
      create: evento,
    });
    console.log(`✅ Evento: ${created.title}`);
  }

  // ── Banners ────────────────────────────────────────────────────────
  const banners = [
    {
      title: "Ritual de Prosperidade",
      subtitle: "Abra os caminhos da abundância com os trabalhos do Mestre Liu Artur",
      imageUrl: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1600",
      ctaLabel: "Conhecer Ritual",
      ctaUrl: "/eventos/ritual-prosperidade-financeira",
      isActive: true,
      order: 1,
    },
    {
      title: "Encontro Presencial — Maio 2026",
      subtitle: "Vagas limitadas para o workshop intensivo de Energia Vital",
      imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600",
      ctaLabel: "Garantir Vaga",
      ctaUrl: "/eventos/encontro-presencial-energia-vital",
      isActive: true,
      order: 2,
    },
    {
      title: "Transformação pelo Amor",
      subtitle: "Rituais de harmonização para relacionamentos e cura emocional",
      imageUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1600",
      ctaLabel: "Saiba Mais",
      ctaUrl: "/eventos/trabalho-de-amor-e-harmonizacao",
      isActive: true,
      order: 3,
    },
  ];

  for (const banner of banners) {
    const event = await db.event.findUnique({
      where: { slug: banner.ctaUrl.replace("/eventos/", "") },
    });

    await db.banner.create({
      data: {
        ...banner,
        eventId: event?.id ?? null,
      },
    }).catch(() => null); // ignora duplicatas em re-seed
    console.log(`✅ Banner: ${banner.title}`);
  }

  // ── Compra de exemplo ─────────────────────────────────────────────
  const primeiroEvento = await db.event.findUnique({
    where: { slug: "ritual-prosperidade-financeira" },
  });
  if (primeiroEvento) {
    await db.purchase.upsert({
      where: { userId_eventId: { userId: testUser.id, eventId: primeiroEvento.id } },
      update: {},
      create: {
        userId: testUser.id,
        eventId: primeiroEvento.id,
        status: PurchaseStatus.CONFIRMED,
        pricePaid: primeiroEvento.price,
        paymentProvider: "stripe",
        paymentId: "pi_seed_example_001",
      },
    });
    console.log("✅ Compra de exemplo criada");
  }

  console.log("\n🎉 Seed concluído com sucesso!");
  console.log("─────────────────────────────────────────");
  console.log("Admin  → admin@mestreliuartur.com.br / Admin@123456");
  console.log("Teste  → teste@email.com / User@123456");
  console.log("─────────────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
