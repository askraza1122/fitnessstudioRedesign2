import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TIER_LABELS } from "@/lib/access";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  requested: {
    label: "Request pending — the studio will confirm your payment",
    cls: "bg-amber-100 text-amber-800",
  },
  paid: {
    label: "Payment confirmed — unlocking shortly",
    cls: "bg-blue-100 text-blue-800",
  },
  unlocked: { label: "Enrolled — full access", cls: "bg-green-100 text-green-800" },
  rejected: {
    label: "Request not approved — you can request again",
    cls: "bg-red-100 text-red-800",
  },
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard");

  const [courses, enrollments] = await Promise.all([
    prisma.course.findMany({
      orderBy: { title: "asc" },
      include: { lectures: { select: { id: true }, take: 1 } },
    }),
    prisma.enrollment.findMany({
      where: { userId: session.user.id },
      include: {
        course: {
          select: { slug: true, title: true, description: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const enrolledSlugs = new Set(enrollments.map((e) => e.course.slug));
  const available = courses.filter((c) => !enrolledSlugs.has(c.slug));

  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      <h1 className="text-4xl font-extrabold text-neutral-900">
        My Courses
      </h1>
      <p className="mt-2 text-neutral-600">
        Welcome, {session.user.name ?? session.user.email}. Here are your
        enrollments and the courses you can join.
      </p>

      <h2 className="mt-10 text-2xl font-extrabold text-neutral-900">
        My enrollments
      </h2>
      {enrollments.length === 0 ? (
        <p className="mt-3 rounded-2xl border border-neutral-200 bg-white p-5 text-neutral-600">
          You haven&apos;t enrolled in any course yet. Pick a program below —
          lectures 1–3 of every course are free once you&apos;re logged in.
        </p>
      ) : (
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {enrollments.map((e) => {
            const status = STATUS_LABEL[e.status] ?? {
              label: e.status,
              cls: "bg-neutral-100 text-neutral-700",
            };
            return (
              <div
                key={e.id}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={e.course.image}
                  alt={e.course.title}
                  className="h-40 w-full object-cover"
                />
                <div className="p-5">
                  <h3 className="text-lg font-bold text-neutral-900">
                    {e.course.title}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-600">
                    {e.course.description}
                  </p>
                  <p className="mt-3 text-sm text-neutral-600">
                    {TIER_LABELS[e.tier] ?? e.tier} · {e.currency}
                  </p>
                  <span
                    className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${status.cls}`}
                  >
                    {status.label}
                  </span>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {e.status === "unlocked" ? (
                      <Link
                        href={`/learn/${e.course.slug}`}
                        className="rounded-full bg-red-700 px-5 py-2 text-sm font-semibold text-white hover:bg-red-800"
                      >
                        Continue learning →
                      </Link>
                    ) : (
                      <Link
                        href={`/learn/${e.course.slug}`}
                        className="rounded-full border border-neutral-300 px-5 py-2 text-sm font-semibold text-neutral-700 hover:border-red-700 hover:text-red-700"
                      >
                        View free lectures
                      </Link>
                    )}
                    {e.status === "rejected" && (
                      <Link
                        href={`/programs/${e.course.slug}`}
                        className="rounded-full bg-red-700 px-5 py-2 text-sm font-semibold text-white hover:bg-red-800"
                      >
                        Request again
                      </Link>
                    )}
                    <Link
                      href={`/programs/${e.course.slug}`}
                      className="rounded-full px-3 py-2 text-sm font-medium text-neutral-600 hover:text-red-700"
                    >
                      Program details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <h2 className="mt-12 text-2xl font-extrabold text-neutral-900">
        Available courses
      </h2>
      {available.length === 0 ? (
        <p className="mt-3 text-neutral-600">
          You&apos;re enrolled in every course — nice!
        </p>
      ) : (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {available.map((c) => (
            <Link
              key={c.slug}
              href={`/programs/${c.slug}`}
              className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-lg"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.image}
                alt={c.title}
                className="h-44 w-full object-cover transition group-hover:scale-[1.02]"
              />
              <div className="p-5">
                <h3 className="text-lg font-bold text-neutral-900 group-hover:text-red-700">
                  {c.title}
                </h3>
                <p className="mt-1 text-sm text-neutral-600">{c.description}</p>
                <p className="mt-3 text-sm font-semibold text-red-700">
                  {c.durationWeeks} weeks · Lectures 1–3 free
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
