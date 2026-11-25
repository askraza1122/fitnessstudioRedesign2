"use client";

import { useCart } from "./CartContext";

export default function AddToCartButton({
  slug,
  label = "Add to Cart",
}: {
  slug: string;
  label?: string;
}) {
  const { add } = useCart();
  return (
    <button
      onClick={() => add(slug)}
      className="mt-3 w-full rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
    >
      {label}
    </button>
  );
}
