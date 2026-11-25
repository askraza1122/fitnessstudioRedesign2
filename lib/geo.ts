export type Region = "PK" | "SA" | "AE";

export const REGION_COOKIE = "fs-region";

export const REGION_LABELS: Record<Region, string> = {
  PK: "Pakistan",
  SA: "Saudi Arabia",
  AE: "United Arab Emirates",
};

export const REGION_CURRENCIES: Record<
  Region,
  { code: "PKR" | "SAR" | "AED"; symbol: string }
> = {
  PK: { code: "PKR", symbol: "Rs" },
  SA: { code: "SAR", symbol: "SAR" },
  AE: { code: "AED", symbol: "AED" },
};

export function isRegion(v: string | undefined | null): v is Region {
  return v === "PK" || v === "SA" || v === "AE";
}

/** Resolve a visitor region from an IP via ip-api.com. Falls back to PK on any failure. */
const cache = new Map<string, { region: Region; at: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export async function regionFromIp(ip: string | null | undefined): Promise<Region> {
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    return "PK";
  }
  const hit = cache.get(ip);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.region;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2000);
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=countryCode`,
      { signal: ctrl.signal }
    );
    clearTimeout(timer);
    if (!res.ok) return "PK";
    const data = (await res.json()) as { countryCode?: string };
    const cc = (data?.countryCode || "").toUpperCase();
    const region: Region = cc === "SA" ? "SA" : cc === "AE" ? "AE" : "PK";
    cache.set(ip, { region, at: Date.now() });
    return region;
  } catch {
    return "PK";
  }
}
