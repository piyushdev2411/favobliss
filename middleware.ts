// middleware.ts
import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  privateRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  // === BOT BLOCKING (EARLY, SITE-WIDE) ===
  const ua = (req.headers.get("user-agent") || "").toLowerCase();

  const badBots = [
    "ahrefsbot",
    "semrushbot",
    "mj12bot",
    "dotbot",
    "petalbot",
    "bytespider",
    "gptbot",
    "claudebot",
    "anthropic",
    "ccbot",
    "omgili",
    "omgilibot",
    "scrapy",
    "python",
    "curl",
    "wget",
    "headlesschrome",
    "lighthouse",
    "bot",
    "crawler",
    "spider",
  ];

  const goodBots = ["googlebot", "bingbot", "duckduckbot", "slurp", "yandex"];

  if (badBots.some((bot) => ua.includes(bot)) && !goodBots.some((good) => ua.includes(good))) {
    return new Response("Forbidden - Bot access denied", { status: 403 });
  }

  // === YOUR EXISTING AUTH LOGIC ===
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(pathname);
  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));

  if (isApiAuthRoute) return null;

  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if (isPrivateRoute && !isLoggedIn) {
    let callbackUrl = pathname + nextUrl.search;
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", callbackUrl);
    return Response.redirect(loginUrl);
  }

  return null;
});

// Run middleware on all routes (except static/_next to avoid waste)
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};