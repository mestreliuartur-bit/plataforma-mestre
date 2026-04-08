import type { NextAuthConfig } from "next-auth";

// Configuração Edge-safe (sem bcrypt, sem Prisma)
// Usada pelo middleware que roda no Edge Runtime
export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role?: string }).role ?? "USER";
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      return session;
    },
  },
  providers: [], // providers reais ficam em auth.ts (Node.js)
} satisfies NextAuthConfig;
