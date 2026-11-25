import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { REGION_COOKIE, isRegion } from "@/lib/geo";

const PKR_TIERS = ["one_to_one", "group", "home"] as const;

async function regionFromCookie() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(REGION_COOKIE)?.value;
  return isRegion(raw) ? raw : "PK";
}

/** My enrollments (logged-in student). Optional ?courseSlug= filter. */
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please log in." }, { status: 401 });
  }
  const url = new URL(req.url);
  const courseSlug = url.searchParams.get("courseSlug");
  const where: { userId: string; course?: { slug: string } } = {
    userId: session.user.id,
  };
  if (courseSlug) where.course = { slug: courseSlug };
  const enrollments = await prisma.enrollment.findMany({
    where,
    include: { course: { select: { slug: true, title: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ enrollments });
}

/**
 * Request enrollment in a course (manual flow — Phase 2 has no payment
 * gateway). Tier/currency follow the same geo-pricing as the site:
 * SA -> flat 200 SAR, AE -> flat 200 AED, otherwise PKR tiers.
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please log in." }, { status: 401 });
  }

  let body: { courseSlug?: string; tier?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const courseSlug = String(body.courseSlug ?? "").trim();
  if (!courseSlug) {
    return NextResponse.json({ error: "courseSlug is required." }, { status: 400 });
  }
  const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
  if (!course) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }

  const region = await regionFromCookie();
  let tier: string;
  let currency: string;
  if (region === "SA") {
    tier = "flat";
    currency = "SAR";
  } else if (region === "AE") {
    tier = "flat";
    currency = "AED";
  } else {
    currency = "PKR";
    tier = String(body.tier ?? "one_to_one");
    if (!(PKR_TIERS as readonly string[]).includes(tier)) {
      return NextResponse.json(
        { error: "tier must be one_to_one, group or home." },
        { status: 400 }
      );
    }
  }

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
  });

  if (existing) {
    if (existing.status === "rejected") {
      // A rejected request can be re-requested.
      const updated = await prisma.enrollment.update({
        where: { id: existing.id },
        data: { tier, currency, status: "requested", decidedBy: null, decidedAt: null },
      });
      return NextResponse.json({ enrollment: updated, reopened: true }, { status: 200 });
    }
    return NextResponse.json({ enrollment: existing, already: true }, { status: 200 });
  }

  const enrollment = await prisma.enrollment.create({
    data: {
      userId: session.user.id,
      courseId: course.id,
      tier,
      currency,
      status: "requested",
    },
  });
  return NextResponse.json({ enrollment }, { status: 201 });
}
