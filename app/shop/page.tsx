import Link from "next/link";
import { PRODUCTS, formatPkr } from "@/lib/data";
import AddToCartButton from "@/components/AddToCartButton";

export default function ShopPage() {
  return (
    <div>
      {/* Modern page head */}
      <section className="bg-dots border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
          <p className="inline-block rounded-full bg-red-700 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
            Herbal wellness · Cash on Delivery
          </p>
          <h1 className="mt-5 font-display text-6xl leading-[0.95] text-neutral-900 md:text-8xl">
            Shop <span className="text-outline-red">Products</span>
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-neutral-600">
            Herbal wellness products from Fitness Studio. Cash on Delivery
            across Pakistan. Shop prices are always in PKR.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p) => {
            const off = Math.round((1 - p.price / p.wasPrice) * 100);
            return (
              <div
                key={p.slug}
                className="group overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <Link href={`/shop/${p.slug}`} className="block overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </Link>
                <div className="p-5">
                  <span className="inline-block rounded-full bg-red-700 px-2.5 py-1 text-xs font-bold text-white">
                    −{off}%
                  </span>
                  <h2 className="mt-3 font-display text-2xl leading-tight text-neutral-900">
                    <Link href={`/shop/${p.slug}`} className="hover:text-red-700">
                      {p.name}
                    </Link>
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{p.blurb}</p>
                  <p className="mt-3">
                    <span className="font-display text-3xl text-red-700">{formatPkr(p.price)}</span>{" "}
                    <span className="text-sm text-neutral-400 line-through">{formatPkr(p.wasPrice)}</span>
                  </p>
                  <div className="mt-4">
                    <AddToCartButton slug={p.slug} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-10 inline-block rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-600">
          Cash on Delivery available across Pakistan · Prices in PKR
        </p>
      </section>
    </div>
  );
}
