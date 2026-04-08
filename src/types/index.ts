// ─────────────────────────────────────────
// Tipos derivados do Prisma (usado no front sem importar o client)
// ─────────────────────────────────────────

export type EventType = "PRESENCIAL" | "DISTANCIA";
export type PurchaseStatus = "PENDING" | "CONFIRMED" | "CANCELLED";
export type ContentType = "VIDEO" | "TEXT" | "PDF" | "AUDIO";
export type UserRole = "USER" | "ADMIN";

export interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  ctaLabel: string;
  ctaUrl: string;
  eventId?: string | null;
  isActive: boolean;
  order: number;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  coverImage: string;
  type: EventType;
  isActive: boolean;
  isPublished: boolean;
  maxSlots?: number | null;
  eventDate?: Date | string | null;
  location?: string | null;
  createdAt: Date | string;
}

export interface Purchase {
  id: string;
  userId: string;
  eventId: string;
  status: PurchaseStatus;
  pricePaid: number;
  createdAt: Date | string;
  event?: Event;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
}
