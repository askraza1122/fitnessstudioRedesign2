import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PRODUCTS, formatPkr } from "@/lib/data";

// COD orders are public (guest checkout, same as Phase 1) but the total is
// always computed server-side from PRODUCTS — the client only sends slugs
// and quantities, never prices.

type IncomingItem = { slug?: string; qty?: number };

export async function POST(req: Request) {
  let body: {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    items?: IncomingItem[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const address = String(body.address ?? "").trim();
  const city = String(body.city ?? "").trim();

  if (!name || !phone || !address || !city) {
    return NextResponse.json(
      { error: "Name, phone, address and city are required." },
      { status: 400 }
    );
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Order has no items." }, { status: 400 });
  }

  const items: { slug: string; name: string; qty: number; price: number }[] = [];
  for (const it of body.items) {
    const product = PRODUCTS.find((p) => p.slug === String(it?.slug ?? ""));
    const qty = Math.floor(Number(it?.qty ?? 0));
    if (!product || qty < 1 || qty > 99) {
      return NextResponse.json(
        { error: `Invalid item: ${String(it?.slug ?? "?")}` },
        { status: 400 }
      );
    }
    items.push({ slug: product.slug, name: product.name, qty, price: product.price });
  }

  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);

  const order = await prisma.order.create({
    data: {
      name,
      phone,
      address,
      city,
      items: JSON.stringify(items),
      total,
      status: "new",
    },
  });

  return NextResponse.json(
    { id: order.id, total, totalFormatted: formatPkr(total) },
    { status: 201 }
  );
}
