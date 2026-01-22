import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  privateRoutes,
} from "@/routes";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const { auth } = NextAuth(authConfig);

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(), 
  limiter: Ratelimit.slidingWindow(10, "10 s"), 
  analytics: true,
});

export default auth(async (req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const ua = (req.headers.get("user-agent") || "").toLowerCase();

  const ip = req.headers.get("x-forwarded-for") || "anonymous";
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return new Response("Rate limit exceeded", { status: 429 });
  }

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

  if (
    badBots.some((bot) => ua.includes(bot)) &&
    !goodBots.some((good) => ua.includes(good))
  ) {
    return new Response("Forbidden - Bot access denied", { status: 403 });
  }

  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(pathname);
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

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

export const config = {
  matcher: [
    '/',
    '/((?!_next/static|_next/image|_next/data|api|favicon.ico|manifest.json|sw.js|robots.txt|sitemap.xml|public).*)',
  ],
};
