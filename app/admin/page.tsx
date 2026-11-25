import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PRODUCTS, formatPkr } from "@/lib/data";
import { TIER_LABELS } from "@/lib/access";
import { bunnyConfig } from "@/lib/bunny";
import { EnrollmentActions, OrderActions } from "@/components/admin/AdminActions";
import LectureEditor from "@/components/admin/LectureEditor";

export const dynamic = "force-dynamic";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "students", label: "Students" },
  { key: "enrollments", label: "Enrollments" },
  { key: "lectures", label: "Lectures" },
  { key: "orders", label: "Orders" },
  { key: "products", label: "Products" },
] as const;

function tabHref(tab: string, extra?: Record<string, string>) {
  const qs = new URLSearchParams({ tab, ...extra });
  return `/admin?${qs.toString()}`;
}

function fmtDate(d: Date) {
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    tab?: string;
    q?: string;
    status?: string;
    course?: string;
  }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "admin") redirect("/dashboard");

  const sp = await searchParams;
  const tab = TABS.some((t) => t.key === sp.tab) ? (sp.tab as string) : "overview";
  const q = (sp.q ?? "").trim();
  const statusFilter = (sp.status ?? "").trim();
  const courseFilter = (sp.course ?? "").trim();

  const [
    studentCount,
    pendingEnrollments,
    orderCount,
    lecturesWithoutVideo,
    courses,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "student" } }),
    prisma.enrollment.count({ where: { status: "requested" } }),
    prisma.order.count(),
    prisma.lecture.count({ where: { videoUrl: null } }),
    prisma.course.findMany({ orderBy: { title: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      <h1 className="text-4xl font-extrabold text-neutral-900">Admin Panel</h1>
      <p className="mt-2 text-neutral-600">
        Manage students, enrollments, lectures and shop orders. Unlocking an
        enrollment immediately gives that student access to lectures 4–8.
      </p>

      <nav className="mt-8 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={tabHref(t.key)}
            className={
              tab === t.key
                ? "rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white"
                : "rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-red-700 hover:text-red-700"
            }
          >
            {t.label}
            {t.key === "enrollments" && pendingEnrollments > 0 && (
              <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs font-bold text-red-700">
                {pendingEnrollments}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {tab === "overview" && (
        <OverviewTab
          studentCount={studentCount}
          pendingEnrollments={pendingEnrollments}
          orderCount={orderCount}
          lecturesWithoutVideo={lecturesWithoutVideo}
        />
      )}

      {tab === "students" && <StudentsTab q={q} />}

      {tab === "enrollments" && <EnrollmentsTab statusFilter={statusFilter} />}

      {tab === "lectures" && (
        <LecturesTab courses={courses} courseFilter={courseFilter} />
      )}

      {tab === "orders" && <OrdersTab statusFilter={statusFilter} />}

      {tab === "products" && <ProductsTab />}
    </div>
  );
}

async function OverviewTab({
  studentCount,
  pendingEnrollments,
  orderCount,
  lecturesWithoutVideo,
}: {
  studentCount: number;
  pendingEnrollments: number;
  orderCount: number;
  lecturesWithoutVideo: number;
}) {
  const bunny = bunnyConfig();
  const cards = [
    { label: "Students", value: studentCount, href: tabHref("students") },
    {
      label: "Enrollments pending",
      value: pendingEnrollments,
      href: tabHref("enrollments", { status: "requested" }),
    },
    { label: "Shop orders", value: orderCount, href: tabHref("orders") },
    {
      label: "Lectures without video",
      value: lecturesWithoutVideo,
      href: tabHref("lectures"),
    },
  ];
  return (
    <div className="mt-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <p className="text-4xl font-extrabold text-neutral-900">{c.value}</p>
            <p className="mt-1 text-sm font-medium text-neutral-600">{c.label}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-neutral-900">Bunny Storage</h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          {bunny.configured ? (
            <>
              Configured — zone <code className="font-mono">{bunny.zone}</code>,
              videos play from{" "}
              <code className="font-mono">{bunny.cdnHost}</code>. Uploads from
              the Lectures tab go to Bunny Storage.
            </>
          ) : (
            <>
              <span className="font-semibold text-amber-700">
                Not configured.
              </span>{" "}
              Lecture uploads are disabled until{" "}
              <code className="font-mono">BUNNY_STORAGE_PASSWORD</code> is set in
              Coolify env (zone defaults to{" "}
              <code className="font-mono">FitnessStudio</code> — override with{" "}
              <code className="font-mono">BUNNY_STORAGE_ZONE</code>). Pasting a
              Bunny CDN URL still works without it.
            </>
          )}
        </p>
      </div>
      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-neutral-900">Manual unlock flow</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-neutral-600">
          <li>Student requests enrollment from a program page (status: requested).</li>
          <li>Student pays by JazzCash / Easypaisa / bank transfer and shares the receipt on WhatsApp.</li>
          <li>Admin opens Enrollments, clicks “Mark paid”, then “Unlock course”.</li>
          <li>Lectures 4–8 of that course become playable for the student immediately.</li>
        </ol>
      </div>
    </div>
  );
}

async function StudentsTab({ q }: { q: string }) {
  const students = await prisma.user.findMany({
    where: q
      ? {
          role: "student",
          OR: [
            { name: { contains: q } },
            { email: { contains: q } },
          ],
        }
      : { role: "student" },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { _count: { select: { enrollments: true } } },
  });
  return (
    <div className="mt-8">
      <form method="get" className="flex flex-wrap gap-2">
        <input type="hidden" name="tab" value="students" />
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by name or email"
          className="w-72 rounded-xl border border-neutral-300 px-4 py-2.5 outline-none focus:border-red-700"
        />
        <button
          type="submit"
          className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700"
        >
          Search
        </button>
        {q && (
          <Link
            href={tabHref("students")}
            className="rounded-full px-3 py-2.5 text-sm font-medium text-neutral-600 hover:text-red-700"
          >
            Clear
          </Link>
        )}
      </form>
      <p className="mt-4 text-sm text-neutral-500">
        {students.length} student{students.length === 1 ? "" : "s"}
        {q ? ` matching “${q}”` : ""} (showing up to 100).
      </p>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-600">
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Phone</th>
              <th className="px-4 py-3 font-semibold">Joined</th>
              <th className="px-4 py-3 font-semibold">Enrollments</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3 font-medium text-neutral-900">{s.name}</td>
                <td className="px-4 py-3 text-neutral-700">{s.email}</td>
                <td className="px-4 py-3 text-neutral-700">{s.phone ?? "—"}</td>
                <td className="px-4 py-3 text-neutral-600">{fmtDate(s.createdAt)}</td>
                <td className="px-4 py-3 text-neutral-700">{s._count.enrollments}</td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-neutral-500">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const ENROLLMENT_FILTERS = ["", "requested", "paid", "unlocked", "rejected"];

async function EnrollmentsTab({ statusFilter }: { statusFilter: string }) {
  const enrollments = await prisma.enrollment.findMany({
    where: statusFilter ? { status: statusFilter } : {},
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { slug: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-2">
        {ENROLLMENT_FILTERS.map((f) => (
          <Link
            key={f || "all"}
            href={tabHref("enrollments", f ? { status: f } : {})}
            className={
              statusFilter === f
                ? "rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white"
                : "rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-red-700 hover:text-red-700"
            }
          >
            {f === "" ? "All" : f}
          </Link>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {enrollments.map((e) => (
          <div
            key={e.id}
            className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold text-neutral-900">
                  {e.user.name} <span className="font-normal text-neutral-500">({e.user.email})</span>
                </p>
                <p className="text-sm text-neutral-600">
                  {e.course.title} · {TIER_LABELS[e.tier] ?? e.tier} · {e.currency} ·{" "}
                  {fmtDate(e.createdAt)}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  e.status === "unlocked"
                    ? "bg-green-100 text-green-800"
                    : e.status === "requested"
                      ? "bg-amber-100 text-amber-800"
                      : e.status === "paid"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                }`}
              >
                {e.status}
              </span>
            </div>
            <div className="mt-3">
              <EnrollmentActions id={e.id} status={e.status} />
            </div>
          </div>
        ))}
        {enrollments.length === 0 && (
          <p className="rounded-2xl border border-neutral-200 bg-white p-6 text-center text-neutral-500">
            No enrollments{statusFilter ? ` with status “${statusFilter}”` : ""}.
          </p>
        )}
      </div>
    </div>
  );
}

async function LecturesTab({
  courses,
  courseFilter,
}: {
  courses: { id: string; slug: string; title: string }[];
  courseFilter: string;
}) {
  const selected = courses.find((c) => c.slug === courseFilter) ?? courses[0];
  const lectures = selected
    ? await prisma.lecture.findMany({
        where: { courseId: selected.id },
        orderBy: { order: "asc" },
      })
    : [];
  const bunny = bunnyConfig();
  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-2">
        {courses.map((c) => (
          <Link
            key={c.slug}
            href={tabHref("lectures", { course: c.slug })}
            className={
              selected?.slug === c.slug
                ? "rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white"
                : "rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-red-700 hover:text-red-700"
            }
          >
            {c.title}
          </Link>
        ))}
      </div>
      {!bunny.configured && (
        <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Bunny Storage is not configured — file uploads are disabled. Set{" "}
          <code className="font-mono">BUNNY_STORAGE_PASSWORD</code> in Coolify env
          to enable uploads. You can still paste a Bunny CDN URL for each lecture.
        </p>
      )}
      {selected ? (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {lectures.map((l) => (
            <LectureEditor key={l.id} lecture={l} />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-neutral-600">
          No courses yet — run the seed script to create the 6 courses and their lectures.
        </p>
      )}
    </div>
  );
}

const ORDER_FILTERS = ["", "new", "confirmed", "delivered", "cancelled"];

async function OrdersTab({ statusFilter }: { statusFilter: string }) {
  const orders = await prisma.order.findMany({
    where: statusFilter ? { status: statusFilter } : {},
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-2">
        {ORDER_FILTERS.map((f) => (
          <Link
            key={f || "all"}
            href={tabHref("orders", f ? { status: f } : {})}
            className={
              statusFilter === f
                ? "rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white"
                : "rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-red-700 hover:text-red-700"
            }
          >
            {f === "" ? "All" : f}
          </Link>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {orders.map((o) => {
          let items: { slug: string; name: string; qty: number; price: number }[] = [];
          try {
            items = JSON.parse(o.items);
          } catch {
            items = [];
          }
          return (
            <div
              key={o.id}
              className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-neutral-900">
                    {o.name} <span className="font-normal text-neutral-500">({o.phone})</span>
                  </p>
                  <p className="text-sm text-neutral-600">
                    {o.address}, {o.city} · {fmtDate(o.createdAt)}
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-neutral-700">
                    {items.map((it) => (
                      <li key={it.slug}>
                        {it.name} × {it.qty} — {formatPkr(it.price * it.qty)}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 font-bold text-neutral-900">
                    Total: {formatPkr(o.total)} (COD)
                  </p>
                </div>
                <OrderActions id={o.id} status={o.status} />
              </div>
            </div>
          );
        })}
        {orders.length === 0 && (
          <p className="rounded-2xl border border-neutral-200 bg-white p-6 text-center text-neutral-500">
            No orders{statusFilter ? ` with status “${statusFilter}”` : ""} yet.
            Orders placed through the shop checkout appear here.
          </p>
        )}
      </div>
    </div>
  );
}

function ProductsTab() {
  return (
    <div className="mt-8">
      <p className="text-sm leading-relaxed text-neutral-600">
        The 4 shop products are defined in the site&apos;s product catalogue
        (same prices as the shop). Product editing is read-only in this panel
        for now — changing a price here would drift from the shop catalogue,
        so price/name changes are a code change until products move into the
        database (a small Phase 3 candidate).
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {PRODUCTS.map((p) => (
          <div
            key={p.slug}
            className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt={p.name} className="h-20 w-20 rounded-xl object-cover" />
            <div>
              <p className="font-bold text-neutral-900">{p.name}</p>
              <p className="text-sm text-neutral-600">{p.blurb}</p>
              <p className="mt-1 text-sm">
                <span className="font-bold text-red-700">{formatPkr(p.price)}</span>{" "}
                <span className="text-neutral-400 line-through">{formatPkr(p.wasPrice)}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
