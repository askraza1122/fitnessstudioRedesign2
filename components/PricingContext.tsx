"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { REGION_COOKIE, REGION_CURRENCIES, REGION_LABELS, type Region } from "@/lib/geo";

export type Currency = "PKR" | "SAR" | "AED";

type PricingState = {
  region: Region;
  currency: Currency;
  regionLabel: string;
  setRegion: (r: Region) => void;
  /** Flat per-course price for SA/AE, or null when PKR tiers apply. */
  flatPrice: { amount: number; code: Currency } | null;
};

const PricingContext = createContext<PricingState>({
  region: "PK",
  currency: "PKR",
  regionLabel: "Pakistan",
  setRegion: () => {},
  flatPrice: null,
});

export function usePricing() {
  return useContext(PricingContext);
}

export function PricingProvider({
  initialRegion,
  children,
}: {
  initialRegion: Region;
  children: ReactNode;
}) {
  const [region, setRegionState] = useState<Region>(initialRegion);

  // Safety net: on mount, sync with the fs-region cookie (covers statically
  // prerendered pages, whose SSR HTML was built with the default region).
  useEffect(() => {
    const m = document.cookie.match(/(?:^|; )fs-region=(SA|AE|PK)/);
    if (m && m[1] !== region) setRegionState(m[1] as Region);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setRegion = (r: Region) => {
    setRegionState(r);
    document.cookie = `${REGION_COOKIE}=${r}; max-age=${60 * 60 * 24 * 7}; path=/`;
  };

  const currency = REGION_CURRENCIES[region].code;
  const flatPrice =
    region === "SA"
      ? { amount: 200, code: "SAR" as Currency }
      : region === "AE"
        ? { amount: 200, code: "AED" as Currency }
        : null;

  return (
    <PricingContext.Provider
      value={{
        region,
        currency,
        regionLabel: REGION_LABELS[region],
        setRegion,
        flatPrice,
      }}
    >
      {children}
    </PricingContext.Provider>
  );
}
