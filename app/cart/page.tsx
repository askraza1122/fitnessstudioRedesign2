"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { formatPkr, waLink } from "@/lib/data";

export default function CartPage() {
  const { lines, count, subtotal, setQty, remove, clear } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [orderSaved, setOrderSaved] = useState(false);
  const [orderSaveFailed, setOrderSaveFailed] = useState(false);
  const [placing, setPlacing] = useState(false);

  if (count === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold text-neutral-900">Your cart is empty</h1>
        <p className="mt-3 text-neutral-600">
          Browse the shop and add a product to get started.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
        >
          Visit the Shop →
        </Link>
      </div>
    );
  }

  const itemLines = lines
    .map((l) => `• ${l.product.name} x ${l.qty} — ${formatPkr(l.lineTotal)}`)
    .join("\n");
  const message = `Hello Fitness Studio! I want to place a COD order:\n\n${itemLines}\n\nTotal: ${formatPkr(subtotal)}\n\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\nCity: ${city}`;

  const placeOrder = async () => {
    if (!name.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      setError("Please fill in your name, phone, address and city.");
      return;
    }
    setError("");
    setPlacing(true);
    // Save the COD order in the database (admin sees it under /admin orders).
    // The WhatsApp checkout still opens either way — a failed save must not
    // block the customer from ordering.
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          address,
          city,
          items: lines.map((l) => ({ slug: l.product.slug, qty: l.qty })),
        }),
      });
      if (res.ok) {
        setOrderSaved(true);
        setOrderSaveFailed(false);
      } else {
        setOrderSaveFailed(true);
      }
    } catch {
      setOrderSaveFailed(true);
    } finally {
      setPlacing(false);
    }
    window.open(waLink(message), "_blank");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      <h1 className="text-4xl font-extrabold text-neutral-900">Your Cart</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {lines.map((l) => (
              <div
                key={l.product.slug}
                className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={l.product.image}
                  alt={l.product.name}
                  className="h-20 w-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="font-bold text-neutral-900">{l.product.name}</p>
                  <p className="text-sm text-neutral-500">{formatPkr(l.product.price)} each</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => setQty(l.product.slug, l.qty - 1)}
                      className="h-8 w-8 rounded-full border border-neutral-300 font-bold hover:border-red-700 hover:text-red-700"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-semibold">{l.qty}</span>
                    <button
                      onClick={() => setQty(l.product.slug, l.qty + 1)}
                      className="h-8 w-8 rounded-full border border-neutral-300 font-bold hover:border-red-700 hover:text-red-700"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                    <button
                      onClick={() => remove(l.product.slug)}
                      className="ml-3 text-sm font-medium text-red-700 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="font-bold text-neutral-900">{formatPkr(l.lineTotal)}</p>
              </div>
            ))}
          </div>
          <button
            onClick={clear}
            className="mt-4 text-sm font-medium text-neutral-500 hover:text-red-700"
          >
            Clear cart
          </button>
        </div>

        <div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-neutral-900">
              Cash on Delivery — checkout
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Fill in your details. Your order opens as a WhatsApp message to
              Fitness Studio — no online payment needed.
            </p>

            <div className="mt-5 space-y-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 outline-none focus:border-red-700"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 outline-none focus:border-red-700"
              />
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Delivery address"
                className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 outline-none focus:border-red-700"
              />
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 outline-none focus:border-red-700"
              />
            </div>

            <div className="mt-5 flex justify-between border-t border-neutral-200 pt-4">
              <span className="font-semibold text-neutral-700">Total (COD)</span>
              <span className="text-xl font-extrabold text-red-700">{formatPkr(subtotal)}</span>
            </div>

            {error && <p className="mt-3 text-sm font-medium text-red-700">{error}</p>}

            <button
              onClick={placeOrder}
              disabled={placing}
              className="mt-5 w-full rounded-full bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
            >
              {placing ? "Saving your order…" : "Place Order via WhatsApp"}
            </button>
            {orderSaved && (
              <p className="mt-3 text-sm font-medium text-green-700">
                ✓ Your order has been saved with Fitness Studio. The WhatsApp
                message has opened — please send it to confirm.
              </p>
            )}
            {orderSaveFailed && (
              <p className="mt-3 text-sm text-amber-700">
                Your order could not be saved online, but the WhatsApp message
                has opened — please send it so the studio has your order.
              </p>
            )}
            <p className="mt-3 text-xs text-neutral-500">
              Prices in PKR. Delivery charges (if any) will be confirmed by the
              Fitness Studio team on WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
