"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePricing } from "./PricingContext";
import { PKR_TIERS, formatPkr } from "@/lib/data";

type EnrollmentState = {
  status: string;
  tier: string;
  currency: string;
} | null;

/**
 * LMS enrollment request (Phase 2, manual flow — no payment gateway yet).
 * Sits under the existing WhatsApp Enroll button in PriceBlock; it never
 * replaces it. Tier/price follow the same geo-pricing as the price block:
 * SA -> flat 200 SAR, AE -> flat 200 AED, otherwise PKR tiers.
 */
export default function EnrollRequest({
  courseSlug,
  programTitle,
}: {
  courseSlug: string;
  programTitle: string;
}) {
  const { data: session, status: sessionStatus } = useSession();
  const { flatPrice } = usePricing();
  const [tierKey, setTierKey] = useState(PKR_TIERS[0].key);
  const [current, setCurrent] = useState<EnrollmentState | null>(null);
  const [checking, setChecking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [justRequested, setJustRequested] = useState(false);

  useEffect(() => {
    if (sessionStatus !== "authenticated") return;
    let cancelled = false;
    setChecking(true);
    fetch(`/api/enrollments?courseSlug=${encodeURIComponent(courseSlug)}`)
      .then((r) => (r.ok ? r.json() : { enrollments: [] }))
      .then((data) => {
        if (cancelled) return;
        const e = data.enrollments?.[0];
        setCurrent(
          e ? { status: e.status, tier: e.tier, currency: e.currency } : null
        );
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [sessionStatus, courseSlug]);

  const request = async () => {
    setBusy(true);
    setError("");
    const res = await fetch("/api/enrollments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseSlug,
        tier: flatPrice ? "flat" : tierKey,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Could not send your request. Please try again.");
      return;
    }
    setCurrent({
      status: data.enrollment.status,
      tier: data.enrollment.tier,
      currency: data.enrollment.currency,
    });
    setJustRequested(true);
  };

  if (sessionStatus === "loading" || checking) {
    return (
      <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-5 text-sm text-neutral-500 shadow-sm">
        Checking your enrollment…
      </div>
    );
  }

  if (sessionStatus !== "authenticated") {
    return (
      <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-neutral-900">
          Enroll online &amp; watch lectures
        </p>
        <p className="mt-1 text-sm leading-relaxed text-neutral-600">
          Request enrollment here to get access to the course lectures
          (lectures 1–3 are free). The studio confirms payment manually.
        </p>
        <Link
          href={`/login?callbackUrl=/programs/${courseSlug}`}
          className="mt-4 block rounded-full bg-neutral-900 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-neutral-700"
        >
          Log in to request enrollment
        </Link>
        <p className="mt-3 text-center text-xs text-neutral-500">
          New here?{" "}
          <Link href="/register" className="font-semibold text-red-700 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    );
  }

  if (current?.status === "unlocked") {
    return (
      <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm">
        <p className="text-sm font-semibold text-green-800">
          ✓ You&apos;re enrolled in {programTitle} — full access.
        </p>
        <Link
          href={`/learn/${courseSlug}`}
          className="mt-4 block rounded-full bg-red-700 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-red-800"
        >
          Continue learning →
        </Link>
      </div>
    );
  }

  if (current?.status === "requested" || current?.status === "paid") {
    return (
      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
        <p className="text-sm font-semibold text-neutral-900">
          {current.status === "requested"
            ? "Request pending — the studio will confirm your payment"
            : "Payment confirmed — the studio will unlock your course shortly"}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-neutral-600">
          {justRequested
            ? "Thanks — your request has been sent."
            : "You can watch lectures 1–3 while you wait."}{" "}
          The studio will share payment details with you on WhatsApp.
        </p>
        <Link
          href={`/learn/${courseSlug}`}
          className="mt-4 block rounded-full border border-neutral-300 bg-white px-6 py-3 text-center text-sm font-semibold text-neutral-700 hover:border-red-700 hover:text-red-700"
        >
          Watch free lectures →
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-neutral-900">
        Enroll online &amp; watch lectures
      </p>
      {current?.status === "rejected" && (
        <p className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          Your previous request was not approved — you can request again below.
        </p>
      )}
      {flatPrice ? (
        <p className="mt-2 text-sm text-neutral-600">
          Flat price:{" "}
          <span className="font-bold text-neutral-900">
            {flatPrice.amount} {flatPrice.code}
          </span>{" "}
          per course. No tiers in your region.
        </p>
      ) : (
        <div className="mt-3 space-y-2">
          {PKR_TIERS.map((tier) => (
            <button
              key={tier.key}
              onClick={() => setTierKey(tier.key)}
              className={
                tier.key === tierKey
                  ? "flex w-full items-center justify-between rounded-xl border-2 border-red-700 bg-red-50 px-3 py-2 text-left text-sm"
                  : "flex w-full items-center justify-between rounded-xl border border-neutral-200 px-3 py-2 text-left text-sm hover:border-red-300"
              }
            >
              <span className="font-semibold text-neutral-900">{tier.label}</span>
              <span className="font-bold text-neutral-900">{formatPkr(tier.price)}</span>
            </button>
          ))}
        </div>
      )}
      {error && <p className="mt-3 text-sm font-medium text-red-700">{error}</p>}
      <button
        onClick={request}
        disabled={busy}
        className="mt-4 w-full rounded-full bg-red-700 px-6 py-3 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60"
      >
        {busy
          ? "Sending request…"
          : flatPrice
            ? `Request enrollment — ${flatPrice.amount} ${flatPrice.code}`
            : "Request enrollment"}
      </button>
      <p className="mt-2 text-xs leading-relaxed text-neutral-500">
        No online payment yet — after your request the studio shares payment
        details on WhatsApp and unlocks your course once paid.
      </p>
    </div>
  );
}
