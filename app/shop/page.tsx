import Link from "next/link";
import { PRODUCTS, formatPkr } from "@/lib/data";
import AddToCartButton from "@/components/AddToCartButton";

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      <h1 className="text-4xl font-extrabold text-neutral-900">Shop</h1>
      <p className="mt-3 max-w-3xl leading-relaxed text-neutral-600">
        Herbal wellness products from Fitness Studio. Cash on Delivery across
        Pakistan. Shop prices are always in PKR.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCTS.map((p) => {
          const off = Math.round((1 - p.price / p.wasPrice) * 100);
          return (
            <div
              key={p.slug}
              className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
            >
              <Link href={`/shop/${p.slug}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.name} className="aspect-square w-full object-cover" />
              </Link>
              <div className="p-4">
                <span className="inline-block rounded-full bg-red-700 px-2 py-0.5 text-xs font-bold text-white">
                  −{off}%
                </span>
                <h2 className="mt-2 font-bold text-neutral-900">
                  <Link href={`/shop/${p.slug}`} className="hover:text-red-700">
                    {p.name}
                  </Link>
                </h2>
                <p className="mt-1 text-sm text-neutral-500">{p.blurb}</p>
                <p className="mt-2 text-sm text-neutral-500">
                  <span className="text-lg font-bold text-red-700">{formatPkr(p.price)}</span>{" "}
                  <span className="line-through">{formatPkr(p.wasPrice)}</span>
                </p>
                <AddToCartButton slug={p.slug} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
