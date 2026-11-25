import { NextRequest, NextResponse } from "next/server";
import { REGION_COOKIE, isRegion, regionFromIp } from "./lib/geo";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|mp4|webp|svg|ico|css|js)).*)",
  ],
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const existing = req.cookies.get(REGION_COOKIE)?.value;
  if (isRegion(existing)) return res;

  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : null;
  const region = await regionFromIp(ip);
  res.cookies.set(REGION_COOKIE, region, {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
