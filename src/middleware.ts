import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Middleware usa apenas auth.config (Edge-safe, sem bcrypt/Prisma)
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return Response.redirect(url);
  }

  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) return Response.redirect(new URL("/login", req.url));
    if (req.auth?.user?.role !== "ADMIN") return Response.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
