import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS, formatPkr, getProduct } from "@/lib/data";
import AddToCartButton from "@/components/AddToCartButton";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const off = Math.round((1 - product.price / product.wasPrice) * 100);
  const others = PRODUCTS.filter((p) => p.slug !== slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
      <Link href="/shop" className="text-sm font-semibold text-red-700 hover:underline">
        ← Back to shop
      </Link>
      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-[2rem] border border-neutral-200 object-cover shadow-sm"
          />
        </div>
        <div>
          <span className="inline-block rounded-full bg-red-700 px-3 py-1 text-xs font-bold text-white">
            −{off}% OFF
          </span>
          <h1 className="mt-5 font-display text-4xl leading-[0.95] text-neutral-900 md:text-5xl">{product.name}</h1>
          <p className="mt-4 text-lg leading-relaxed text-neutral-600">{product.blurb}</p>
          <p className="mt-6">
            <span className="text-3xl font-extrabold text-red-700">{formatPkr(product.price)}</span>{" "}
            <span className="text-lg text-neutral-400 line-through">{formatPkr(product.wasPrice)}</span>
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            Cash on Delivery · Prices in PKR
          </p>
          <div className="mt-8 max-w-xs">
            <AddToCartButton slug={product.slug} />
            <Link
              href="/cart"
              className="mt-3 block rounded-full border-2 border-neutral-900 px-4 py-2 text-center text-sm font-semibold text-neutral-900 hover:bg-neutral-900 hover:text-white"
            >
              View Cart →
            </Link>
          </div>
        </div>
      </div>

      <h2 className="mt-20 font-display text-4xl text-neutral-900">You may also like</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {others.map((p) => (
          <Link
            key={p.slug}
            href={`/shop/${p.slug}`}
            className="group overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt={p.name} className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105" />
            <div className="p-5">
              <p className="font-bold text-neutral-900">{p.name}</p>
              <p className="mt-1 text-sm">
                <span className="font-bold text-red-700">{formatPkr(p.price)}</span>{" "}
                <span className="text-neutral-400 line-through">{formatPkr(p.wasPrice)}</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
