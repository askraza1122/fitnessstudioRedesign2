import Link from "next/link";
import {
  AWARD_PHOTOS,
  COURSE_DURATION,
  MOU_PARTNERS,
  PHONE_DISPLAY,
  PKR_TIERS,
  PRODUCTS,
  PROGRAMS,
  STATS,
  TESTIMONIALS,
  formatPkr,
  waLink,
} from "@/lib/data";
import AddToCartButton from "@/components/AddToCartButton";
import ProgramCard from "@/components/ProgramCard";

const MARQUEE_WORDS = [
  "STRONG",
  "FIT",
  "CONFIDENT",
  "4 WEEKS",
  "WOMEN ONLY",
  "SELF-DEFENSE",
  "YOGA",
  "PCOS CARE",
];

const TIER_FEATURES = [
  "4 weeks · Every course",
  "Online or in-person in Lahore",
  "Enroll via WhatsApp",
];

const AWARD_NAMES = [
  "National Summit Award",
  "Pride of Pakistan",
  "Womenza Award",
  "She Inspires Award (Bolton, UK)",
  "PNY & Dynamic Awards (Govt. of Pakistan)",
  "101 CEO Awards",
  "Heritage Global Mentorship Award (Africa)",
  "Youth Parliament Award",
];

export default function HomePage() {
  const upcoming = {
    src: "/media/IMG-20261105-WA0053.jpg",
    title: "Protect, Empower and Thrive",
    detail:
      "Speaker: Ms. Ayesha Muzammil — Self Defense Strategist & Wellness Consultant, CEO Fitness Studio. Saturday 28 November 2026, 11:00 AM – 12:30 PM, 8 Raza Block, Allama Iqbal Town, Lahore. Hosted by Qasim Ali Shah Foundation.",
  };

  return (
    <div>
      {/* Marquee — the modern signature right under the header */}
      <div className="overflow-hidden bg-calm py-3" aria-hidden>
        <div className="flex w-max animate-marquee">
          {[0, 1].map((half) => (
            <span
              key={half}
              className="flex shrink-0 items-center font-display text-xl tracking-wide text-white md:text-2xl"
            >
              {MARQUEE_WORDS.map((w) => (
                <span key={w} className="flex items-center">
                  <span className="px-5">{w}</span>
                  <span className="text-white/50">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Hero — editorial modern: giant type, offset red frame, dot grid */}
      <section className="bg-dots relative overflow-hidden bg-white">
        <div
          aria-hidden
          className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-red-100/70 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-10 md:grid-cols-12 md:pb-24 md:pt-14">
          <div className="animate-fade-up md:col-span-7">
            <p className="inline-flex items-center gap-2 rounded-full bg-calm px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
              Women-only studio · Lahore · Est. by Ayeesha Muzammil
            </p>
            <h1 className="mt-6 font-display text-[16vw] leading-[0.9] text-neutral-900 sm:text-8xl md:text-[7.5rem]">
              Strong
              <br />
              <span className="text-outline">Is Your</span>
              <br />
              <span className="text-red-700">Superpower</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-neutral-600">
              Pakistan&apos;s most trusted women-only training studio.{" "}
              <strong className="text-neutral-900">
                Self-defense, yoga, PCOS care and real weight loss
              </strong>{" "}
              — structured 4-week programs led by certified coaches, in-studio,
              online, or at your home.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/programs"
                className="group rounded-full bg-red-700 px-7 py-3.5 font-semibold text-white shadow-lg shadow-red-700/25 transition hover:bg-red-800"
              >
                Explore Programs
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <Link
                href="/shop"
                className="rounded-full border-2 border-neutral-900 px-7 py-3.5 font-semibold text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
              >
                Shop Products
              </Link>
            </div>
            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap gap-3 border-t border-neutral-200 pt-6">
              {[
                {
                  title: "4 weeks",
                  sub: "Every course",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  ),
                },
                {
                  title: "Enroll via WhatsApp",
                  sub: "Chat to book your batch",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  ),
                },
                {
                  title: "Cash on Delivery",
                  sub: "Available in the shop",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
                      <rect x="2" y="6" width="20" height="12" rx="2" />
                      <circle cx="12" cy="12" r="2.5" />
                      <path d="M6 12h.01M18 12h.01" />
                    </svg>
                  ),
                },
              ].map((b) => (
                <div
                  key={b.title}
                  className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-calm-light text-calm">
                    {b.icon}
                  </span>
                  <span>
                    <span className="block text-sm font-bold leading-tight text-neutral-900">
                      {b.title}
                    </span>
                    <span className="block text-xs leading-tight text-neutral-500">
                      {b.sub}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="animate-fade-up relative md:col-span-5 [animation-delay:150ms]">
            <div
              aria-hidden
              className="absolute inset-0 rotate-3 rounded-[2.5rem] bg-red-700"
            />
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl shadow-neutral-900/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/training/ceo-portrait-professional.webp"
                alt="Ayeesha Muzammil, CEO Fitness Studio"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="animate-float-soft absolute left-2 top-10 rounded-2xl border border-neutral-100 bg-white/90 px-4 py-3 shadow-xl backdrop-blur md:-left-8">
              <p className="font-display text-xl leading-none text-neutral-900">
                5,000+
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Women trained
              </p>
            </div>
            <div className="animate-float-soft absolute bottom-8 right-2 rounded-2xl border border-neutral-100 bg-white/90 px-4 py-3 shadow-xl backdrop-blur [animation-delay:1.2s] md:-right-6">
              <p className="font-display text-xl leading-none text-neutral-900">
                {COURSE_DURATION}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Every course
              </p>
            </div>
            <p className="mt-6 text-center text-sm text-neutral-500">
              Ayeesha Muzammil — Founder &amp; CEO, Fitness Studio
            </p>
          </div>
        </div>
      </section>

      {/* Press strip */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-3 px-4 py-6">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            Featured on
          </span>
          {["Voice of America", "DW", "92 News", "GNN", "Discover Pakistan"].map((name, i, arr) => (
            <span key={name} className="flex items-center gap-6">
              <span className="font-display text-2xl tracking-wide text-neutral-800">
                {name}
              </span>
              {i < arr.length - 1 && <span className="text-calm">✦</span>}
            </span>
          ))}
        </div>
      </section>

      {/* Stats — modern cards, not a plain row */}
      <section className="bg-neutral-50 py-14">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <p className="font-display text-6xl leading-none text-calm">
                {s.value}
              </p>
              <p className="mt-3 text-sm font-bold uppercase tracking-wider text-neutral-900">
                {s.label}
              </p>
              <span className="mt-4 block h-1.5 w-12 rounded-full bg-red-700" />
            </div>
          ))}
        </div>
      </section>

      {/* Programs preview — bento grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-block rounded-full bg-calm px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
              Training Programs
            </p>
            <h2 className="mt-4 font-display text-5xl leading-[0.95] text-neutral-900 md:text-7xl">
              Pick your <span className="text-red-700">program.</span>
            </h2>
            <p className="mt-3 max-w-xl text-neutral-600">
              Six programs, each {COURSE_DURATION} long. Learn online or in
              person in Lahore.
            </p>
          </div>
          <Link
            href="/programs"
            className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            View all programs →
          </Link>
        </div>
        {/* Editorial grid: feature + tall, three equal, full-width anchor — every row fills completely */}
        <div className="mt-10 grid gap-5 md:grid-cols-6">
          <ProgramCard
            p={PROGRAMS[0]}
            index={0}
            className="min-h-[26rem] md:col-span-4"
          />
          <ProgramCard
            p={PROGRAMS[1]}
            index={1}
            className="min-h-[26rem] md:col-span-2"
          />
          <ProgramCard
            p={PROGRAMS[2]}
            index={2}
            className="min-h-[22rem] md:col-span-2"
          />
          <ProgramCard
            p={PROGRAMS[3]}
            index={3}
            className="min-h-[22rem] md:col-span-2"
          />
          <ProgramCard
            p={PROGRAMS[4]}
            index={4}
            className="min-h-[22rem] md:col-span-2"
          />
          <ProgramCard p={PROGRAMS[5]} index={5} wide className="md:col-span-6" />
        </div>
      </section>

      {/* Pricing — featured middle card in red */}
      <section id="pricing" className="border-y border-neutral-200 bg-neutral-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <p className="inline-block rounded-full bg-calm px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
            Pricing
          </p>
          <h2 className="mt-4 font-display text-5xl leading-[0.95] text-neutral-900 md:text-7xl">
            Simple Pricing. <span className="text-red-700">No Surprises.</span>
          </h2>
          <p className="mt-3 max-w-2xl text-neutral-600">
            Every course is {COURSE_DURATION}. Flat 200 SAR per course in Saudi
            Arabia and 200 AED in the UAE — PKR tiers apply in Pakistan.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {PKR_TIERS.map((t, i) => {
              const featured = i === 1;
              return (
                <div
                  key={t.key}
                  className={`relative rounded-[2rem] p-7 shadow-sm ${
                    featured
                      ? "bg-red-700 text-white shadow-xl shadow-red-700/25 md:-translate-y-3"
                      : "border border-neutral-200 bg-white"
                  }`}
                >
                  {featured && (
                    <span className="absolute -top-3.5 left-7 rounded-full bg-neutral-900 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-white">
                      Most popular
                    </span>
                  )}
                  <h3
                    className={`font-display text-3xl ${
                      featured ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {t.label}
                  </h3>
                  <p
                    className={`mt-3 font-display text-5xl ${
                      featured ? "text-white" : "text-red-700"
                    }`}
                  >
                    {formatPkr(t.price)}
                  </p>
                  <p
                    className={`mt-2 text-sm leading-relaxed ${
                      featured ? "text-white/85" : "text-neutral-600"
                    }`}
                  >
                    {t.note}
                  </p>
                  <ul className="mt-5 space-y-2.5 text-sm font-medium">
                    {TIER_FEATURES.map((f) => (
                      <li key={f} className="flex items-center gap-2.5">
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
                            featured ? "bg-white text-red-700" : "bg-calm-light text-calm"
                          }`}
                        >
                          ✓
                        </span>
                        <span className={featured ? "text-white" : "text-neutral-700"}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={waLink(
                      `Hello Fitness Studio! I want to enroll (${t.label}: ${formatPkr(t.price)}). Please share the next steps.`
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className={`mt-6 inline-block rounded-full px-6 py-3 text-sm font-semibold transition ${
                      featured
                        ? "bg-white text-red-700 hover:bg-red-100"
                        : "bg-neutral-900 text-white hover:bg-red-700"
                    }`}
                  >
                    Enroll — {t.label}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About teaser — offset red frame + credential pills */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-0 -rotate-2 rounded-[2.5rem] bg-calm"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/IMG-20261114-WA0044-enhanced.webp"
              alt="Ayeesha Muzammil"
              className="relative w-full rounded-[2.5rem] object-cover shadow-xl"
            />
            <div className="absolute -bottom-5 left-5 rounded-2xl bg-white px-4 py-3 shadow-xl">
              <p className="text-sm font-bold text-neutral-900">
                Kukkiwon Black Belt · South Korea
              </p>
              <p className="text-xs text-neutral-500">
                Pakistan&apos;s first certified Para-Taekwondo instructor
              </p>
            </div>
          </div>
          <div>
            <p className="inline-block rounded-full bg-calm px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
              Founder
            </p>
            <h2 className="mt-4 font-display text-5xl leading-[0.95] text-neutral-900 md:text-6xl">
              Meet Ayeesha <span className="text-red-700">Muzammil</span>
            </h2>
            <p className="mt-5 leading-relaxed text-neutral-700">
              Pakistan&apos;s first certified Para-Taekwondo instructor (Kukkiwon
              black belt, South Korea), certified yoga trainer (University of
              California), and Pakistan&apos;s first female author of a
              self-defense book. She has trained thousands of girls and working
              women — in person and online.
            </p>
            <p className="mt-3 leading-relaxed text-neutral-700">
              Her mission began after the APS incident: no child, no woman
              should ever have to depend on anyone else for her safety.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "Kukkiwon Black Belt",
                "UC Certified Yoga Trainer",
                "First Female Self-Defense Author",
              ].map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700"
                >
                  {c}
                </span>
              ))}
            </div>
            <Link
              href="/about"
              className="mt-7 inline-block rounded-full bg-neutral-900 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
            >
              Read her story →
            </Link>
          </div>
        </div>
      </section>

      {/* Shop preview */}
      <section className="border-y border-neutral-200 bg-neutral-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="inline-block rounded-full bg-calm px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
                Shop
              </p>
              <h2 className="mt-4 font-display text-5xl leading-[0.95] text-neutral-900 md:text-7xl">
                Our Best <span className="text-red-700">Products</span>
              </h2>
              <p className="mt-3 text-neutral-600">
                Herbal wellness products — cash on delivery across Pakistan.
              </p>
            </div>
            <Link
              href="/shop"
              className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Visit the shop →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                    <h3 className="mt-3 font-display text-2xl leading-tight text-neutral-900">
                      <Link href={`/shop/${p.slug}`} className="hover:text-red-700">
                        {p.name}
                      </Link>
                    </h3>
                    <p className="mt-3">
                      <span className="font-display text-3xl text-red-700">
                        {formatPkr(p.price)}
                      </span>{" "}
                      <span className="text-sm text-neutral-400 line-through">
                        {formatPkr(p.wasPrice)}
                      </span>
                    </p>
                    <div className="mt-4">
                      <AddToCartButton slug={p.slug} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-6 text-sm text-neutral-500">
            Shop prices are always in PKR. Cash on Delivery.
          </p>
        </div>
      </section>

      {/* Your 4 weeks — timeline */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <p className="inline-block rounded-full bg-calm px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
          How It Works
        </p>
        <h2 className="mt-4 font-display text-5xl leading-[0.95] text-neutral-900 md:text-7xl">
          Your 4 Weeks, <span className="text-red-700">Week By Week</span>
        </h2>
        <div className="relative mt-12">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-7 hidden h-0.5 bg-calm/25 lg:block"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { week: "Week 01", title: "Assess & Begin", text: "Body assessment, goal setting and foundations. You learn the basics correctly — posture, breathing, form — before intensity rises." },
              { week: "Week 02", title: "Build The Habit", text: "Structured sessions deepen. Technique sharpens, stamina climbs, and your coach adjusts the plan to how your body responds." },
              { week: "Week 03", title: "Push The Level", text: "The hardest week — advanced drills, stronger sequences, measurable progress checks against your Week 1 baseline." },
              { week: "Week 04", title: "Own The Result", text: "Final assessment, results review and your maintenance roadmap — so the change you made in 4 weeks stays with you." },
            ].map((st, i) => (
              <div
                key={st.week}
                className="relative rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm"
              >
                <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-calm font-display text-xl text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-calm">
                  {st.week}
                </p>
                <h3 className="mt-2 font-display text-2xl text-neutral-900">
                  {st.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {st.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements — big-type award list + photos */}
      <section className="border-y border-neutral-200 bg-neutral-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="inline-block rounded-full bg-calm px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
                Recognition
              </p>
              <h2 className="mt-4 font-display text-5xl leading-[0.95] text-neutral-900 md:text-7xl">
                Recognition <span className="text-red-700">&amp; Awards</span>
              </h2>
            </div>
            <Link
              href="/achievements"
              className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              All achievements →
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
            {AWARD_NAMES.map((a) => (
              <span key={a} className="flex items-center gap-4">
                <span className="font-display text-2xl text-neutral-900 md:text-3xl">
                  {a}
                </span>
                <span className="text-calm">✦</span>
              </span>
            ))}
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {AWARD_PHOTOS.slice(0, 4).map((a) => (
              <div key={a.src} className="group overflow-hidden rounded-[2rem]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={a.src}
                  alt={a.caption}
                  className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <p className="inline-block rounded-full bg-calm px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
          Testimonials
        </p>
        <h2 className="mt-4 font-display text-5xl leading-[0.95] text-neutral-900 md:text-7xl">
          Our clients <span className="text-red-700">talk about us</span>
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="rounded-[2rem] border border-neutral-200 bg-white p-7 shadow-sm"
            >
              <span className="font-display text-6xl leading-none text-calm">
                &ldquo;
              </span>
              <blockquote className="leading-relaxed text-neutral-700">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-neutral-100 pt-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-calm font-display text-sm text-white">
                  {t.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <span>
                  <span className="block font-bold text-neutral-900">{t.name}</span>
                  <span className="block text-sm text-neutral-500">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* MoU strip */}
      <section className="border-y border-neutral-200 bg-white py-14">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="inline-block rounded-full bg-calm px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
                Partners
              </p>
              <h2 className="mt-4 font-display text-4xl leading-none text-neutral-900 md:text-5xl">
                MoU Partners
              </h2>
            </div>
            <Link
              href="/mou-partners"
              className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              All partners →
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {MOU_PARTNERS.slice(0, 8).map((name) => (
              <span
                key={name}
                className="rounded-2xl border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-700 transition hover:border-calm hover:text-calm"
              >
                {name}
              </span>
            ))}
            <span className="rounded-2xl bg-calm px-5 py-3 text-sm font-bold text-white">
              + {MOU_PARTNERS.length - 8} more
            </span>
          </div>
        </div>
      </section>

      {/* Upcoming event */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid items-center gap-8 overflow-hidden rounded-[2.5rem] bg-red-700 text-white md:grid-cols-2">
          <div className="p-8 md:p-12">
            <p className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-red-700">
              Upcoming event · 28 Nov 2026
            </p>
            <h2 className="mt-4 font-display text-4xl leading-[0.95] md:text-5xl">
              {upcoming.title}
            </h2>
            <p className="mt-4 leading-relaxed text-red-100">{upcoming.detail}</p>
            <a
              href={waLink(
                "Hello Fitness Studio! I want to attend the 'Protect, Empower and Thrive' session on Saturday 28 November 2026. Please share details."
              )}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-block rounded-full bg-white px-6 py-3 font-semibold text-red-700 transition hover:bg-red-100"
            >
              Reserve your seat on WhatsApp
            </a>
          </div>
          <div className="h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={upcoming.src}
              alt="Protect, Empower and Thrive — 28 November 2026"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <p className="inline-block rounded-full bg-calm px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
          Questions
        </p>
        <h2 className="mt-4 font-display text-5xl leading-[0.95] text-neutral-900 md:text-7xl">
          Before You <span className="text-red-700">Start</span>
        </h2>
        <div className="mt-10">
          {[
            { q: "How long is each program?", a: "Every program runs for 4 weeks with a structured weekly plan — assessment in Week 1, progressive training in Weeks 2–3, and a final results review in Week 4." },
            { q: "Can I join from outside Lahore?", a: "Yes. Programs are delivered online across Pakistan, and for Saudi Arabia and the UAE at a flat 200 SAR / 200 AED per course. In-studio and home-trainer options are Lahore-based." },
            { q: "Is the studio really women-only?", a: "Yes — batches, coaches and trainers are women-only, including the home-trainer service, so you can train comfortably and privately." },
            { q: "Which program is right for PCOS?", a: "The PCOS / PCOD program is built specifically for hormonal weight gain, irregular cycles and low energy — combining therapeutic movement with sustainable routine building over 4 weeks." },
            { q: "How do I enroll?", a: "Message us on WhatsApp at +92 324 4696424 or call the studio. Tell us your program and preferred format (group, one-to-one, or home trainer) and we’ll confirm your batch and start date." },
          ].map((f) => (
            <details key={f.q} className="group border-b border-neutral-200 py-5 first:border-t">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span className="text-lg font-bold text-neutral-900">{f.q}</span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-calm-light text-xl text-calm transition group-open:rotate-45 group-open:bg-calm group-open:text-white">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-3xl leading-relaxed text-neutral-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA — giant outlined type behind */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-red-700 px-6 py-14 text-center text-white md:px-12 md:py-20">
          <p
            aria-hidden
            className="text-outline-white pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[19vw] leading-none opacity-20 md:text-[10rem]"
          >
            START TODAY
          </p>
          <div className="relative">
            <h2 className="font-display text-5xl leading-[0.95] md:text-7xl">
              Start your journey today
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-red-100">
              Join thousands of women who train with Fitness Studio — online or in
              person in Lahore.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/programs"
                className="rounded-full bg-white px-7 py-3.5 font-semibold text-red-700 transition hover:bg-red-100"
              >
                Explore Programs
              </Link>
              <a
                href={waLink("Hello Fitness Studio! I want to know more about your programs.")}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-green-600 px-7 py-3.5 font-semibold text-white transition hover:bg-green-700"
              >
                WhatsApp {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
