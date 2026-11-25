"use client";

import { useState } from "react";
import { usePricing } from "./PricingContext";
import {
  COURSE_DURATION,
  PKR_TIERS,
  formatPkr,
  waLink,
  type Program,
} from "@/lib/data";

/** Full geo-aware price block for a program detail page. */
export function PriceBlock({ program }: { program: Program }) {
  const { flatPrice, regionLabel } = usePricing();
  const [tierKey, setTierKey] = useState(PKR_TIERS[0].key);

  if (flatPrice) {
    const message = `Hello Fitness Studio! I want to enroll in ${program.title} (${COURSE_DURATION}). Flat price: ${flatPrice.amount} ${flatPrice.code}. Please share the next steps.`;
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-700">
          Course fee
        </p>
        <p className="mt-2 text-4xl font-extrabold text-neutral-900">
          {flatPrice.amount} {flatPrice.code}
        </p>
        <p className="mt-1 text-sm text-neutral-600">
          Flat price per course — no tiers. Duration: {COURSE_DURATION}.
        </p>
        <p className="mt-1 text-xs text-neutral-500">
          Prices shown for {regionLabel}.
        </p>
        <a
          href={waLink(message)}
          target="_blank"
          rel="noreferrer"
          className="mt-5 block rounded-full bg-green-600 px-6 py-3 text-center font-semibold text-white hover:bg-green-700"
        >
          Enroll via WhatsApp
        </a>
      </div>
    );
  }

  const selected = PKR_TIERS.find((t) => t.key === tierKey) ?? PKR_TIERS[0];
  const message = `Hello Fitness Studio! I want to enroll in ${program.title} (${COURSE_DURATION}). ${selected.label}: ${formatPkr(selected.price)}. Please share the next steps.`;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-red-700">
        Course fee — choose your format
      </p>
      <div className="mt-4 space-y-3">
        {PKR_TIERS.map((tier) => (
          <button
            key={tier.key}
            onClick={() => setTierKey(tier.key)}
            className={
              tier.key === tierKey
                ? "flex w-full items-center justify-between rounded-xl border-2 border-red-700 bg-red-50 px-4 py-3 text-left"
                : "flex w-full items-center justify-between rounded-xl border border-neutral-200 px-4 py-3 text-left hover:border-red-300"
            }
          >
            <span>
              <span className="block font-semibold text-neutral-900">{tier.label}</span>
              <span className="block text-sm text-neutral-500">{tier.note}</span>
            </span>
            <span className="text-lg font-bold text-neutral-900">{formatPkr(tier.price)}</span>
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-neutral-600">
        Duration: {COURSE_DURATION}. Prices shown for {regionLabel}.
      </p>
      <a
        href={waLink(message)}
        target="_blank"
        rel="noreferrer"
        className="mt-5 block rounded-full bg-green-600 px-6 py-3 text-center font-semibold text-white hover:bg-green-700"
      >
        Enroll via WhatsApp — {selected.label} {formatPkr(selected.price)}
      </a>
    </div>
  );
}

/** Compact one-line price for program cards. */
export function CoursePriceLine() {
  const { flatPrice } = usePricing();
  if (flatPrice) {
    return (
      <span className="font-bold text-red-700">
        {flatPrice.amount} {flatPrice.code} flat
      </span>
    );
  }
  return (
    <span className="font-bold text-red-700">
      From {formatPkr(5000)} per head
    </span>
  );
}
