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
  { key: "overview", label: "Overview", icon: "▦" },
  { key: "students", label: "Students", icon: "◉" },
  { key: "enrollments", label: "Enrollments", icon: "✓" },
  { key: "lectures", label: "Lectures", icon: "▶" },
  { key: "orders", label: "Orders", icon: "▣" },
  { key: "products", label: "Products", icon: "◇" },
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

/** Normalize a Pakistani phone number for wa.me links. */
function waPhone(raw: string) {
  const d = raw.replace(/\D/g, "");
  if (d.startsWith("92")) return d;
  if (d.startsWith("0")) return `92${d.slice(1)}`;
  return d;
}

function waCustomerLink(phone: string, message: string) {
  return `https://wa.me/${waPhone(phone)}?text=${encodeURIComponent(message)}`;
}

const STATUS_PILL: Record<string, string> = {
  unlocked: "bg-green-100 text-green-800",
  requested: "bg-amber-100 text-amber-800",
  paid: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  new: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${
        STATUS_PILL[status] ?? "bg-neutral-100 text-neutral-700"
      }`}
    >
      {status}
    </span>
  );
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
    totalLectures,
    courses,
    recentEnrollments,
    recentOrders,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "student" } }),
    prisma.enrollment.count({ where: { status: "requested" } }),
    prisma.order.count(),
    prisma.lecture.count({ where: { videoUrl: null } }),
    prisma.lecture.count(),
    prisma.course.findMany({ orderBy: { title: "asc" } }),
    prisma.enrollment.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: { select: { name: true } },
        course: { select: { title: true } },
      },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="admin-scope min-h-screen bg-neutral-50">
      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 md:px-6">
        {/* Sidebar — desktop */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-calm">
                Fitness Studio
              </p>
              <p className="mt-1 text-xl font-extrabold tracking-tight text-neutral-900">
                Admin Console
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                Orders, students, courses &amp; videos — all in one place.
              </p>
              <Link
                href="/"
                target="_blank"
                className="mt-4 inline-block rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-700"
              >
                View live site ↗
              </Link>
            </div>

            <nav className="space-y-1 rounded-[1.5rem] border border-neutral-200 bg-white p-3 shadow-sm">
              {TABS.map((t) => (
                <Link
                  key={t.key}
                  href={tabHref(t.key)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                    tab === t.key
                      ? "bg-red-700 text-white"
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <span className="w-5 text-center">{t.icon}</span>
                  {t.label}
                  {t.key === "enrollments" && pendingEnrollments > 0 && (
                    <span
                      className={`ml-auto rounded-full px-2 py-0.5 text-xs font-bold ${
                        tab === t.key
                          ? "bg-white text-red-700"
                          : "bg-red-700 text-white"
                      }`}
                    >
                      {pendingEnrollments}
                    </span>
                  )}
                  {t.key === "lectures" && lecturesWithoutVideo > 0 && (
                    <span
                      className={`ml-auto rounded-full px-2 py-0.5 text-xs font-bold ${
                        tab === t.key
                          ? "bg-white text-amber-700"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {lecturesWithoutVideo} missing
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            <div className="rounded-[1.5rem] border border-calm-light bg-calm-soft p-5">
              <p className="text-sm font-bold text-calm">Video readiness</p>
              <p className="mt-1 text-3xl font-extrabold tracking-tight text-neutral-900">
                {totalLectures - lecturesWithoutVideo}
                <span className="text-lg text-neutral-500"> / {totalLectures}</span>
              </p>
              <p className="text-sm text-neutral-600">lectures have a video</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-calm transition-all"
                  style={{
                    width: `${totalLectures ? Math.round(((totalLectures - lecturesWithoutVideo) / totalLectures) * 100) : 0}%`,
                  }}
                />
              </div>
              <Link
                href={tabHref("lectures")}
                className="mt-3 inline-block text-sm font-semibold text-calm hover:underline"
              >
                Upload missing videos →
              </Link>
            </div>
          </div>
        </aside>

        {/* Main column */}
        <main className="min-w-0 flex-1">
          <header>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-calm">
              Admin Console
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900 md:text-4xl">
              {TABS.find((t) => t.key === tab)?.label ?? "Overview"}
            </h1>
            <p className="mt-2 max-w-2xl leading-relaxed text-neutral-600">
              {tab === "overview" &&
                "Everything at a glance — what needs your attention today, and the fastest way to handle it."}
              {tab === "students" &&
                "Everyone who registered on the site. Search by name or email to find a student fast."}
              {tab === "enrollments" &&
                "Unlocking an enrollment immediately gives that student access to lectures 4–8."}
              {tab === "lectures" &&
                "Upload course videos to Bunny, preview them here, and choose which lectures are free."}
              {tab === "orders" &&
                "Cash-on-delivery shop orders. Confirm, message the customer on WhatsApp, and mark delivered."}
              {tab === "products" &&
                "The 4 shop products, as listed in the shop catalogue."}
            </p>
          </header>

          {/* Mobile nav — pills, hidden on desktop where the sidebar lives */}
          <nav className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {TABS.map((t) => (
              <Link
                key={t.key}
                href={tabHref(t.key)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
                  tab === t.key
                    ? "bg-red-700 text-white"
                    : "border border-neutral-300 bg-white text-neutral-700"
                }`}
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
              totalLectures={totalLectures}
              recentEnrollments={recentEnrollments}
              recentOrders={recentOrders}
            />
          )}

          {tab === "students" && <StudentsTab q={q} />}

          {tab === "enrollments" && <EnrollmentsTab statusFilter={statusFilter} />}

          {tab === "lectures" && (
            <LecturesTab courses={courses} courseFilter={courseFilter} />
          )}

          {tab === "orders" && <OrdersTab statusFilter={statusFilter} q={q} />}

          {tab === "products" && <ProductsTab />}
        </main>
      </div>
    </div>
  );
}

async function OverviewTab({
  studentCount,
  pendingEnrollments,
  orderCount,
  lecturesWithoutVideo,
  totalLectures,
  recentEnrollments,
  recentOrders,
}: {
  studentCount: number;
  pendingEnrollments: number;
  orderCount: number;
  lecturesWithoutVideo: number;
  totalLectures: number;
  recentEnrollments: {
    id: string;
    status: string;
    createdAt: Date;
    user: { name: string | null };
    course: { title: string };
  }[];
  recentOrders: {
    id: string;
    name: string;
    total: number;
    status: string;
    createdAt: Date;
  }[];
}) {
  const bunny = bunnyConfig();
  const withVideo = totalLectures - lecturesWithoutVideo;
  const videoPct = totalLectures
    ? Math.round((withVideo / totalLectures) * 100)
    : 0;
  const cards = [
    {
      label: "Students",
      value: studentCount,
      href: tabHref("students"),
      chip: "bg-calm-light text-calm",
      icon: "◉",
      note: "registered accounts",
      attention: false,
    },
    {
      label: "Enrollments pending",
      value: pendingEnrollments,
      href: tabHref("enrollments", { status: "requested" }),
      chip: "bg-amber-100 text-amber-800",
      icon: "◷",
      note: pendingEnrollments > 0 ? "needs your decision" : "all caught up",
      attention: pendingEnrollments > 0,
    },
    {
      label: "Shop orders",
      value: orderCount,
      href: tabHref("orders"),
      chip: "bg-red-100 text-red-700",
      icon: "▣",
      note: "all-time COD orders",
      attention: false,
    },
    {
      label: "Lectures without video",
      value: lecturesWithoutVideo,
      href: tabHref("lectures"),
      chip: "bg-amber-100 text-amber-800",
      icon: "▶",
      note: `${videoPct}% of lectures have video`,
      attention: lecturesWithoutVideo > 0,
    },
  ];
  return (
    <div className="mt-8 space-y-6">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className={`rounded-[1.5rem] border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
              c.attention ? "border-amber-300 ring-1 ring-amber-200" : "border-neutral-200"
            }`}
          >
            <span
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-lg ${c.chip}`}
            >
              {c.icon}
            </span>
            <p className="mt-3 text-4xl font-extrabold tracking-tight text-neutral-900">
              {c.value}
            </p>
            <p className="mt-1 text-sm font-semibold text-neutral-800">{c.label}</p>
            <p className="text-xs text-neutral-500">{c.note}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: "Upload a lecture video",
            desc: "Pick a course, upload to Bunny, preview it here.",
            href: tabHref("lectures"),
          },
          {
            label: "Review pending enrollments",
            desc: "Mark paid, then unlock lectures 4–8.",
            href: tabHref("enrollments", { status: "requested" }),
          },
          {
            label: "Handle new orders",
            desc: "Confirm, WhatsApp the customer, mark delivered.",
            href: tabHref("orders", { status: "new" }),
          },
        ].map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="group rounded-[1.5rem] border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-calm hover:shadow-md"
          >
            <p className="font-bold text-neutral-900 group-hover:text-calm">
              {a.label} →
            </p>
            <p className="mt-1 text-sm text-neutral-600">{a.desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900">Latest enrollments</h2>
            <Link
              href={tabHref("enrollments")}
              className="text-sm font-semibold text-red-700 hover:underline"
            >
              View all →
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {recentEnrollments.map((e) => (
              <li
                key={e.id}
                className="flex items-center justify-between gap-3 border-b border-neutral-100 pb-3 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-neutral-900">
                    {e.user.name ?? "—"}
                  </p>
                  <p className="truncate text-sm text-neutral-500">
                    {e.course.title} · {fmtDate(e.createdAt)}
                  </p>
                </div>
                <StatusPill status={e.status} />
              </li>
            ))}
            {recentEnrollments.length === 0 && (
              <li className="py-4 text-center text-sm text-neutral-500">
                No enrollments yet.
              </li>
            )}
          </ul>
        </div>
        <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900">Latest orders</h2>
            <Link
              href={tabHref("orders")}
              className="text-sm font-semibold text-red-700 hover:underline"
            >
              View all →
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {recentOrders.map((o) => (
              <li
                key={o.id}
                className="flex items-center justify-between gap-3 border-b border-neutral-100 pb-3 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-neutral-900">{o.name}</p>
                  <p className="truncate text-sm text-neutral-500">
                    {formatPkr(o.total)} (COD) · {fmtDate(o.createdAt)}
                  </p>
                </div>
                <StatusPill status={o.status} />
              </li>
            ))}
            {recentOrders.length === 0 && (
              <li className="py-4 text-center text-sm text-neutral-500">
                No orders yet.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Bunny + unlock flow */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-neutral-900">Bunny Storage</h2>
            {bunny.configured ? (
              <span className="rounded-full bg-calm-light px-2.5 py-0.5 text-xs font-bold text-calm">
                Connected
              </span>
            ) : (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                Not configured
              </span>
            )}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            {bunny.configured ? (
              <>
                Zone <code className="font-mono">{bunny.zone}</code>, videos play
                from <code className="font-mono">{bunny.cdnHost}</code>. Uploads
                from the Lectures tab go to Bunny Storage.
              </>
            ) : (
              <>
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
        <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-neutral-900">Manual unlock flow</h2>
          <ol className="mt-3 space-y-2.5 text-sm leading-relaxed text-neutral-600">
            {[
              "Student requests enrollment from a program page (status: requested).",
              "Student pays by JazzCash / Easypaisa / bank transfer and shares the receipt on WhatsApp.",
              "Admin opens Enrollments, clicks “Mark paid”, then “Unlock course”.",
              "Lectures 4–8 of that course become playable for the student immediately.",
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-calm-light text-xs font-bold text-calm">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
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
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
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
          className="w-72 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 outline-none focus:border-calm"
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
      <div className="mt-4 overflow-x-auto rounded-[1.5rem] border border-neutral-200 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-600">
              <th className="px-5 py-3.5 font-semibold">Name</th>
              <th className="px-5 py-3.5 font-semibold">Email</th>
              <th className="px-5 py-3.5 font-semibold">Phone</th>
              <th className="px-5 py-3.5 font-semibold">Joined</th>
              <th className="px-5 py-3.5 font-semibold">Enrollments</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr
                key={s.id}
                className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50"
              >
                <td className="px-5 py-3.5 font-semibold text-neutral-900">{s.name}</td>
                <td className="px-5 py-3.5 text-neutral-700">{s.email}</td>
                <td className="px-5 py-3.5 text-neutral-700">
                  {s.phone ? (
                    <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="hover:text-calm hover:underline">
                      {s.phone}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-5 py-3.5 text-neutral-600">{fmtDate(s.createdAt)}</td>
                <td className="px-5 py-3.5">
                  <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-bold text-neutral-700">
                    {s._count.enrollments}
                  </span>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-neutral-500">
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
  const [enrollments, counts] = await Promise.all([
    prisma.enrollment.findMany({
      where: statusFilter ? { status: statusFilter } : {},
      include: {
        user: { select: { name: true, email: true, phone: true } },
        course: { select: { slug: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.enrollment.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);
  const countFor = (f: string) =>
    f === ""
      ? counts.reduce((n, c) => n + c._count._all, 0)
      : (counts.find((c) => c.status === f)?._count._all ?? 0);
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
                : "rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:border-red-700 hover:text-red-700"
            }
          >
            {f === "" ? "All" : f} ({countFor(f)})
          </Link>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {enrollments.map((e) => (
          <div
            key={e.id}
            className="rounded-[1.5rem] border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-neutral-900">
                  {e.user.name}{" "}
                  <span className="font-normal text-neutral-500">({e.user.email})</span>
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  {e.course.title} · {TIER_LABELS[e.tier] ?? e.tier} · {e.currency} ·{" "}
                  {fmtDate(e.createdAt)}
                </p>
                {e.user.phone && (
                  <a
                    href={waCustomerLink(
                      e.user.phone,
                      `Hello ${e.user.name ?? ""}! This is Fitness Studio regarding your enrollment in ${e.course.title}.`
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                  >
                    WhatsApp {e.user.phone}
                  </a>
                )}
              </div>
              <StatusPill status={e.status} />
            </div>
            <div className="mt-4 border-t border-neutral-100 pt-4">
              <EnrollmentActions id={e.id} status={e.status} />
            </div>
          </div>
        ))}
        {enrollments.length === 0 && (
          <p className="rounded-[1.5rem] border border-neutral-200 bg-white p-6 text-center text-neutral-500">
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
  const withVideo = lectures.filter((l) => l.videoUrl).length;
  const freeCount = lectures.filter((l) => l.isFree).length;
  const pct = lectures.length ? Math.round((withVideo / lectures.length) * 100) : 0;
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
                : "rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:border-red-700 hover:text-red-700"
            }
          >
            {c.title}
          </Link>
        ))}
      </div>
      {!bunny.configured && (
        <p className="mt-4 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Bunny Storage is not configured — file uploads are disabled. Set{" "}
          <code className="font-mono">BUNNY_STORAGE_PASSWORD</code> in Coolify env
          to enable uploads. You can still paste a Bunny CDN URL for each lecture.
        </p>
      )}
      {selected && (
        <>
          {/* Course progress */}
          <div className="mt-4 rounded-[1.5rem] border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">{selected.title}</h2>
                <p className="mt-0.5 text-sm text-neutral-600">
                  {withVideo} of {lectures.length} lectures have video · {freeCount}{" "}
                  free preview{freeCount === 1 ? "" : "s"}
                </p>
              </div>
              <p className="text-2xl font-extrabold tracking-tight text-neutral-900">
                {pct}
                <span className="text-base text-neutral-500">% ready</span>
              </p>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-calm transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            {lectures.length - withVideo > 0 && (
              <p className="mt-2 text-sm font-medium text-amber-700">
                {lectures.length - withVideo} lecture
                {lectures.length - withVideo === 1 ? "" : "s"} still need
                {lectures.length - withVideo === 1 ? "s" : ""} a video — open cards
                below are already expanded.
              </p>
            )}
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {lectures.map((l) => (
              <LectureEditor key={l.id} lecture={l} />
            ))}
          </div>
        </>
      )}
      {!selected && (
        <p className="mt-4 text-neutral-600">
          No courses yet — run the seed script to create the 6 courses and their lectures.
        </p>
      )}
    </div>
  );
}

const ORDER_FILTERS = ["", "new", "confirmed", "delivered", "cancelled"];

async function OrdersTab({
  statusFilter,
  q,
}: {
  statusFilter: string;
  q: string;
}) {
  const [orders, counts, revenue] = await Promise.all([
    prisma.order.findMany({
      where: {
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { phone: { contains: q, mode: "insensitive" } },
                { city: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: "delivered" },
    }),
  ]);
  const countFor = (f: string) =>
    f === ""
      ? counts.reduce((n, c) => n + c._count._all, 0)
      : (counts.find((c) => c.status === f)?._count._all ?? 0);
  const newCount = countFor("new");
  return (
    <div className="mt-8">
      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total orders", value: String(countFor("")), sub: "all time" },
          { label: "New", value: String(newCount), sub: "need confirmation" },
          {
            label: "Delivered revenue",
            value: formatPkr(revenue._sum.total ?? 0),
            sub: "COD collected",
          },
          {
            label: "Cancelled",
            value: String(countFor("cancelled")),
            sub: "all time",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-[1.5rem] border border-neutral-200 bg-white p-4 shadow-sm"
          >
            <p className="text-xl font-extrabold tracking-tight text-neutral-900">
              {s.value}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-neutral-800">{s.label}</p>
            <p className="text-xs text-neutral-500">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <form method="get" className="mt-6 flex flex-wrap gap-2">
        <input type="hidden" name="tab" value="orders" />
        {statusFilter && <input type="hidden" name="status" value={statusFilter} />}
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by name, phone or city"
          className="w-72 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 outline-none focus:border-calm"
        />
        <button
          type="submit"
          className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700"
        >
          Search
        </button>
        {q && (
          <Link
            href={tabHref("orders", statusFilter ? { status: statusFilter } : {})}
            className="rounded-full px-3 py-2.5 text-sm font-medium text-neutral-600 hover:text-red-700"
          >
            Clear
          </Link>
        )}
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        {ORDER_FILTERS.map((f) => (
          <Link
            key={f || "all"}
            href={tabHref("orders", f ? { status: f } : {})}
            className={
              statusFilter === f
                ? "rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white"
                : "rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:border-red-700 hover:text-red-700"
            }
          >
            {f === "" ? "All" : f} ({countFor(f)})
          </Link>
        ))}
      </div>

      {/* Order cards */}
      <div className="mt-4 space-y-3">
        {orders.map((o) => {
          let items: { slug: string; name: string; qty: number; price: number }[] = [];
          try {
            items = JSON.parse(o.items);
          } catch {
            items = [];
          }
          const waMsg = `Hello ${o.name}! This is Fitness Studio about your order (${items
            .map((it) => `${it.name} x ${it.qty}`)
            .join(", ")}) — Total ${formatPkr(o.total)} (Cash on Delivery). Current status: ${o.status}.`;
          return (
            <div
              key={o.id}
              className="rounded-[1.5rem] border border-neutral-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-neutral-900">
                    {o.name}{" "}
                    <a
                      href={`tel:${o.phone.replace(/\s/g, "")}`}
                      className="font-semibold text-calm hover:underline"
                    >
                      {o.phone}
                    </a>
                  </p>
                  <p className="mt-1 text-sm text-neutral-600">
                    {o.address}, {o.city} · {fmtDate(o.createdAt)}
                  </p>
                </div>
                <StatusPill status={o.status} />
              </div>

              <ul className="mt-4 space-y-2 border-t border-neutral-100 pt-4">
                {items.map((it) => {
                  const img = PRODUCTS.find((p) => p.slug === it.slug)?.image;
                  return (
                    <li key={it.slug} className="flex items-center gap-3 text-sm">
                      {img && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={img}
                          alt={it.name}
                          className="h-11 w-11 rounded-lg object-cover"
                        />
                      )}
                      <span className="flex-1 font-medium text-neutral-800">
                        {it.name}
                        <span className="text-neutral-500"> × {it.qty}</span>
                      </span>
                      <span className="font-semibold text-neutral-900">
                        {formatPkr(it.price * it.qty)}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-4">
                <p className="text-lg font-extrabold tracking-tight text-neutral-900">
                  Total: {formatPkr(o.total)}{" "}
                  <span className="text-sm font-medium text-neutral-500">(COD)</span>
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={waCustomerLink(o.phone, waMsg)}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700"
                  >
                    WhatsApp customer
                  </a>
                  <OrderActions id={o.id} status={o.status} />
                </div>
              </div>
            </div>
          );
        })}
        {orders.length === 0 && (
          <p className="rounded-[1.5rem] border border-neutral-200 bg-white p-6 text-center text-neutral-500">
            No orders{statusFilter ? ` with status “${statusFilter}”` : ""}
            {q ? ` matching “${q}”` : ""} yet. Orders placed through the shop
            checkout appear here.
          </p>
        )}
      </div>
    </div>
  );
}

function ProductsTab() {
  return (
    <div className="mt-8">
      <p className="max-w-3xl text-sm leading-relaxed text-neutral-600">
        The 4 shop products are defined in the site&apos;s product catalogue
        (same prices as the shop). Product editing is read-only in this panel
        for now — changing a price here would drift from the shop catalogue,
        so price/name changes are a code change until products move into the
        database (a small Phase 3 candidate).
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {PRODUCTS.map((p) => (
          <div
            key={p.slug}
            className="flex gap-4 rounded-[1.5rem] border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt={p.name} className="h-20 w-20 rounded-xl object-cover" />
            <div className="min-w-0">
              <p className="font-bold text-neutral-900">{p.name}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-neutral-600">{p.blurb}</p>
              <p className="mt-2 text-sm">
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
