// Mock data para desenvolvimento — substituir por queries Prisma em produção

import type { Banner, Event } from "@/types";

export const mockBanners: Banner[] = [
  {
    id: "1",
    title: "Ritual de Prosperidade",
    subtitle: "Abra os caminhos da abundância com a força dos Orixás",
    imageUrl: "/images/banners/prosperidade.jpg",
    ctaLabel: "Garantir minha Vaga",
    ctaUrl: "/eventos/ritual-de-prosperidade",
    isActive: true,
    order: 0,
  },
  {
    id: "2",
    title: "Gira de Exu",
    subtitle: "Uma noite de transformação e abertura de caminhos",
    imageUrl: "/images/banners/exu.jpg",
    ctaLabel: "Saber Mais",
    ctaUrl: "/eventos/gira-de-exu",
    isActive: true,
    order: 1,
  },
  {
    id: "3",
    title: "Trabalho à Distância",
    subtitle: "Rituais realizados pelo Mestre Liu Artur especialmente para você",
    imageUrl: "/images/banners/distancia.jpg",
    ctaLabel: "Solicitar Ritual",
    ctaUrl: "/eventos/ritual-distancia",
    isActive: true,
    order: 2,
  },
];

export const mockEvents: Event[] = [
  {
    id: "1",
    slug: "ritual-de-prosperidade",
    title: "Ritual de Prosperidade",
    description:
      "Um poderoso ritual de abertura de caminhos para atrair abundância financeira, amor e saúde. Realizado presencialmente com a presença do Mestre Liu Artur.",
    price: 297,
    coverImage: "/images/events/prosperidade.jpg",
    type: "PRESENCIAL",
    isActive: true,
    isPublished: true,
    eventDate: "2026-05-15T20:00:00.000Z",
    location: "São Paulo - SP",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    slug: "gira-de-exu",
    title: "Gira de Exu — Abertura de Caminhos",
    description:
      "Trabalho poderoso com a energia de Exu para desfazer amarrações, quebrar obstáculos e abrir caminhos bloqueados.",
    price: 197,
    coverImage: "/images/events/exu.jpg",
    type: "PRESENCIAL",
    isActive: true,
    isPublished: true,
    eventDate: "2026-04-30T21:00:00.000Z",
    location: "São Paulo - SP",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "3",
    slug: "ritual-distancia",
    title: "Ritual à Distância — Amor e União",
    description:
      "Ritual realizado pelo Mestre Liu Artur à distância. Poderoso trabalho de amor para unir casais e fortalecer relacionamentos.",
    price: 147,
    coverImage: "/images/events/distancia.jpg",
    type: "DISTANCIA",
    isActive: true,
    isPublished: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];
