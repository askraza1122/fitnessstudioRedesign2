"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useCart } from "./CartContext";
import { usePricing } from "./PricingContext";
import type { Region } from "@/lib/geo";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/shop", label: "Shop" },
  { href: "/achievements", label: "Achievements" },
  { href: "/mou-partners", label: "MoU Partners" },
  { href: "/media", label: "Media" },
  { href: "/contact", label: "Contact" },
];

const REGIONS: { code: Region; label: string }[] = [
  { code: "PK", label: "PKR" },
  { code: "SA", label: "SAR" },
  { code: "AE", label: "AED" },
];

export default function Header() {
  const pathname = usePathname();
  const { count } = useCart();
  const { region, setRegion } = usePricing();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = session?.user?.role === "admin";

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Fitness Studio" className="h-20 w-auto md:h-28" />
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                pathname === item.href
                  ? "text-[13px] font-bold uppercase tracking-wider text-red-700"
                  : "text-[13px] font-bold uppercase tracking-wider text-neutral-800 hover:text-red-700"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center rounded-full border border-neutral-300 p-0.5"
            title="Choose your currency"
          >
            {REGIONS.map((r) => (
              <button
                key={r.code}
                onClick={() => setRegion(r.code)}
                className={
                  region === r.code
                    ? "rounded-full bg-red-700 px-2.5 py-1 text-xs font-semibold text-white"
                    : "rounded-full px-2.5 py-1 text-xs font-medium text-neutral-600 hover:text-red-700"
                }
              >
                {r.label}
              </button>
            ))}
          </div>

          <Link
            href="/cart"
            className="relative rounded-full border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:border-red-700 hover:text-red-700"
          >
            Cart
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-700 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          {status === "authenticated" && session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden rounded-full border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:border-red-700 hover:text-red-700 sm:block"
              >
                My Courses
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="hidden rounded-full border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:border-red-700 hover:text-red-700 sm:block"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:border-red-700 hover:text-red-700"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:border-red-700 hover:text-red-700"
            >
              Login
            </Link>
          )}

          <Link
            href="/programs"
            className="hidden rounded-md bg-red-700 px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white hover:bg-red-800 md:block"
          >
            Enroll Now
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium lg:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-neutral-200 bg-white px-4 py-3 lg:hidden">
          <div className="grid grid-cols-2 gap-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={
                  pathname === item.href
                    ? "rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700"
                    : "rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                }
              >
                {item.label}
              </Link>
            ))}
            {status === "authenticated" ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  My Courses
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                  >
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
