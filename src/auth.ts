import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validations/auth";
import { authConfig } from "./auth.config";
import { logAudit } from "@/lib/audit";

function getRequestMeta(request?: Request) {
  if (!request) return { ipAddress: undefined, userAgent: undefined };
  const ipAddress =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    undefined;
  const userAgent = request.headers.get("user-agent") ?? undefined;
  return { ipAddress, userAgent };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },

  events: {
    async signOut(message) {
      const token = "token" in message ? message.token : null;
      if (!token?.id) return;
      await logAudit({
        userId: token.id as string,
        userName: (token.name as string) ?? (token.email as string) ?? "Usuário",
        action: "LOGOUT",
        entity: "Auth",
        entityId: token.id as string,
        label: `Logout de "${token.name ?? token.email}"`,
      });
    },
  },

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials, request) {
        const { ipAddress, userAgent } = getRequestMeta(request);

        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await db.user.findUnique({ where: { email } });
        if (!user || !user.password) {
          await logAudit({
            userName: email,
            action: "LOGIN_FAILED",
            entity: "Auth",
            entityId: "unknown",
            label: `Tentativa de login falhou para "${email}" (usuário não encontrado)`,
            ipAddress,
            userAgent,
          });
          return null;
        }

        const passwordMatch = await compare(password, user.password);
        if (!passwordMatch) {
          await logAudit({
            userId: user.id,
            userName: user.name,
            action: "LOGIN_FAILED",
            entity: "Auth",
            entityId: user.id,
            label: `Tentativa de login falhou para "${user.name}" (senha incorreta)`,
            ipAddress,
            userAgent,
          });
          return null;
        }

        await logAudit({
          userId: user.id,
          userName: user.name,
          action: "LOGIN",
          entity: "Auth",
          entityId: user.id,
          label: `Login de "${user.name}" (${user.email})`,
          ipAddress,
          userAgent,
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
});
