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
    <div className="mx-auto max-w-7xl px-4 py-14">
      <Link href="/shop" className="text-sm font-semibold text-red-700 hover:underline">
        ← Back to shop
      </Link>
      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-3xl border border-neutral-200 object-cover shadow-sm"
          />
        </div>
        <div>
          <span className="inline-block rounded-full bg-red-700 px-3 py-1 text-xs font-bold text-white">
            −{off}% OFF
          </span>
          <h1 className="mt-4 text-3xl font-extrabold text-neutral-900">{product.name}</h1>
          <p className="mt-3 leading-relaxed text-neutral-600">{product.blurb}</p>
          <p className="mt-5">
            <span className="text-3xl font-extrabold text-red-700">{formatPkr(product.price)}</span>{" "}
            <span className="text-lg text-neutral-400 line-through">{formatPkr(product.wasPrice)}</span>
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            Cash on Delivery · Prices in PKR
          </p>
          <div className="mt-6 max-w-xs">
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

      <h2 className="mt-16 text-2xl font-extrabold text-neutral-900">You may also like</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {others.map((p) => (
          <Link
            key={p.slug}
            href={`/shop/${p.slug}`}
            className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt={p.name} className="aspect-square w-full object-cover" />
            <div className="p-4">
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
