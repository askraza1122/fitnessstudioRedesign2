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
import { CoursePriceLine } from "@/components/PriceBlock";
import AddToCartButton from "@/components/AddToCartButton";

export default function HomePage() {
  const upcoming = {
    src: "/media/IMG-20261105-WA0053.jpg",
    title: "Protect, Empower and Thrive",
    detail:
      "Speaker: Ms. Ayesha Muzammil — Self Defense Strategist & Wellness Consultant, CEO Fitness Studio. Saturday 28 November 2026, 11:00 AM – 12:30 PM, 8 Raza Block, Allama Iqbal Town, Lahore. Hosted by Qasim Ali Shah Foundation.",
  };

  return (
    <div>
      {/* Hero — redesign: STRONG IS YOUR SUPERPOWER */}
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-10 md:grid-cols-12 md:pb-24 md:pt-14">
          <div className="animate-fade-up md:col-span-7">
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-neutral-900">
              <span className="h-0.5 w-10 bg-red-700" />
              Women-only studio · Lahore · Est. by Ayeesha Muzammil
            </p>
            <h1 className="mt-6 font-display text-[16vw] leading-[0.92] text-neutral-900 sm:text-8xl md:text-[7.25rem]">
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
            {/* Trust badges — the enrollment facts as icons, not a repeat of the stats bar below */}
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
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-700">
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
              className="absolute -inset-3 rounded-b-[2rem] rounded-t-[999px] border-2 border-red-700/15"
            />
            <div className="relative overflow-hidden rounded-b-[2rem] rounded-t-[999px] shadow-2xl shadow-neutral-900/20">
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

      {/* Trust strip */}
      <section className="border-y border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 py-5">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            Featured on
          </span>
          {["Voice of America", "DW", "92 News", "GNN", "Discover Pakistan"].map((name) => (
            <span key={name} className="text-lg font-extrabold tracking-tight text-neutral-700">
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-5xl text-red-700">{s.value}</p>
              <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-neutral-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Programs preview */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker">Training Programs</p>
            <h2 className="mt-2 font-display text-5xl leading-none text-neutral-900 md:text-6xl">Training Programs</h2>
            <p className="mt-2 text-neutral-600">
              Six programs, each {COURSE_DURATION} long. Learn online or in person in Lahore.
            </p>
          </div>
          <Link href="/programs" className="font-semibold text-red-700 hover:underline">
            View all programs →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((p) => (
            <Link
              key={p.slug}
              href={`/programs/${p.slug}`}
              className="group overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent" />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-neutral-900 backdrop-blur">
                  {COURSE_DURATION}
                </span>
                <span className="absolute right-3 top-3 rounded-full bg-red-700 px-3 py-1 text-xs font-bold text-white">
                  Women only
                </span>
                <span className="absolute bottom-3 left-4 text-sm font-semibold text-white">
                  Online &amp; in-person
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-neutral-900 group-hover:text-red-700">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{p.short}</p>
                <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
                  <p className="text-sm">
                    <CoursePriceLine />
                  </p>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-lg text-red-700 transition group-hover:bg-red-700 group-hover:text-white">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Pricing — real tiers */}
      <section id="pricing" className="border-y border-neutral-200 bg-neutral-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <p className="kicker">Pricing</p>
          <h2 className="mt-2 font-display text-5xl leading-none text-neutral-900 md:text-6xl">
            Simple Pricing. <span className="text-red-700">No Surprises.</span>
          </h2>
          <p className="mt-3 max-w-2xl text-neutral-600">
            Every course is {COURSE_DURATION}. Flat 200 SAR per course in Saudi
            Arabia and 200 AED in the UAE — PKR tiers apply in Pakistan.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {PKR_TIERS.map((t) => (
              <div
                key={t.key}
                className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
              >
                <h3 className="font-display text-3xl text-neutral-900">{t.label}</h3>
                <p className="mt-2 font-display text-4xl text-red-700">
                  {formatPkr(t.price)}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{t.note}</p>
                <a
                  href={waLink(
                    `Hello Fitness Studio! I want to enroll (${t.label}: ${formatPkr(t.price)}). Please share the next steps.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-block rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-700"
                >
                  Enroll — {t.label}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="bg-red-50">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/IMG-20261114-WA0044-enhanced.webp"
              alt="Ayeesha Muzammil"
              className="w-full rounded-3xl object-cover shadow-lg"
            />
          </div>
          <div>
            <p className="kicker">Founder</p>
            <h2 className="mt-2 font-display text-5xl leading-none text-neutral-900">Meet Ayeesha Muzammil</h2>
            <p className="mt-4 leading-relaxed text-neutral-700">
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
            <Link
              href="/about"
              className="mt-6 inline-block rounded-full bg-neutral-900 px-6 py-3 font-semibold text-white hover:bg-neutral-700"
            >
              Read her story →
            </Link>
          </div>
        </div>
      </section>

      {/* Shop preview */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker">Shop</p>
            <h2 className="mt-2 font-display text-5xl leading-none text-neutral-900 md:text-6xl">Our Best Products</h2>
            <p className="mt-2 text-neutral-600">
              Herbal wellness products — cash on delivery across Pakistan.
            </p>
          </div>
          <Link href="/shop" className="font-semibold text-red-700 hover:underline">
            Visit the shop →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                  <h3 className="mt-2 font-bold text-neutral-900">
                    <Link href={`/shop/${p.slug}`} className="hover:text-red-700">
                      {p.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-neutral-500">
                    <span className="text-base font-bold text-red-700">{formatPkr(p.price)}</span>{" "}
                    <span className="line-through">{formatPkr(p.wasPrice)}</span>
                  </p>
                  <AddToCartButton slug={p.slug} />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-sm text-neutral-500">
          Shop prices are always in PKR. Cash on Delivery.
        </p>
      </section>

      {/* Your 4 weeks, week by week */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <p className="kicker">How It Works</p>
        <h2 className="mt-2 font-display text-5xl leading-none text-neutral-900 md:text-6xl">
          Your 4 Weeks, <span className="text-red-700">Week By Week</span>
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { week: "Week 01", title: "Assess & Begin", text: "Body assessment, goal setting and foundations. You learn the basics correctly — posture, breathing, form — before intensity rises." },
            { week: "Week 02", title: "Build The Habit", text: "Structured sessions deepen. Technique sharpens, stamina climbs, and your coach adjusts the plan to how your body responds." },
            { week: "Week 03", title: "Push The Level", text: "The hardest week — advanced drills, stronger sequences, measurable progress checks against your Week 1 baseline." },
            { week: "Week 04", title: "Own The Result", text: "Final assessment, results review and your maintenance roadmap — so the change you made in 4 weeks stays with you." },
          ].map((st) => (
            <div key={st.week} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-700">{st.week}</p>
              <h3 className="mt-3 font-display text-2xl text-neutral-900">{st.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{st.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements strip */}
      <section className="border-y border-neutral-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <p className="kicker">Recognition</p>
            <h2 className="mt-2 font-display text-5xl leading-none text-neutral-900">Recognition &amp; Awards</h2>
            <Link href="/achievements" className="font-semibold text-red-700 hover:underline">
              All achievements →
            </Link>
          </div>
          <p className="mt-3 max-w-3xl text-neutral-600">
            National Summit Award · Pride of Pakistan · Womenza Award · She
            Inspires Award (Bolton, UK) · PNY &amp; Dynamic Awards (Govt. of
            Pakistan) · 101 CEO Awards · Heritage Global Mentorship Award (Africa)
            · Youth Parliament Award
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {AWARD_PHOTOS.slice(0, 4).map((a) => (
              <div key={a.src} className="overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.src} alt={a.caption} className="aspect-[4/3] w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <p className="kicker">Testimonials</p>
        <h2 className="mt-2 font-display text-5xl leading-none text-neutral-900">Our clients talk about us</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <blockquote className="leading-relaxed text-neutral-700">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-4">
                <p className="font-bold text-neutral-900">{t.name}</p>
                <p className="text-sm text-neutral-500">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* MoU strip */}
      <section className="border-y border-neutral-200 bg-neutral-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <p className="kicker">Partners</p>
            <h2 className="mt-2 font-display text-4xl leading-none text-neutral-900">MoU Partners</h2>
            <Link href="/mou-partners" className="font-semibold text-red-700 hover:underline">
              All partners →
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {MOU_PARTNERS.slice(0, 8).map((name) => (
              <span
                key={name}
                className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700"
              >
                {name}
              </span>
            ))}
            <span className="rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white">
              + {MOU_PARTNERS.length - 8} more
            </span>
          </div>
        </div>
      </section>

      {/* Upcoming event */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-red-700 text-white md:grid-cols-2">
          <div className="p-8 md:p-10">
            <p className="text-sm font-bold uppercase tracking-widest text-red-200">
              Upcoming event
            </p>
            <h2 className="mt-3 text-3xl font-extrabold">{upcoming.title}</h2>
            <p className="mt-4 leading-relaxed text-red-100">{upcoming.detail}</p>
            <a
              href={waLink(
                "Hello Fitness Studio! I want to attend the 'Protect, Empower and Thrive' session on Saturday 28 November 2026. Please share details."
              )}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block rounded-full bg-white px-6 py-3 font-semibold text-red-700 hover:bg-red-100"
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
        <p className="kicker">Questions</p>
        <h2 className="mt-2 font-display text-5xl leading-none text-neutral-900 md:text-6xl">
          Before You <span className="text-red-700">Start</span>
        </h2>
        <div className="mt-8 space-y-3">
          {[
            { q: "How long is each program?", a: "Every program runs for 4 weeks with a structured weekly plan — assessment in Week 1, progressive training in Weeks 2–3, and a final results review in Week 4." },
            { q: "Can I join from outside Lahore?", a: "Yes. Programs are delivered online across Pakistan, and for Saudi Arabia and the UAE at a flat 200 SAR / 200 AED per course. In-studio and home-trainer options are Lahore-based." },
            { q: "Is the studio really women-only?", a: "Yes — batches, coaches and trainers are women-only, including the home-trainer service, so you can train comfortably and privately." },
            { q: "Which program is right for PCOS?", a: "The PCOS / PCOD program is built specifically for hormonal weight gain, irregular cycles and low energy — combining therapeutic movement with sustainable routine building over 4 weeks." },
            { q: "How do I enroll?", a: "Message us on WhatsApp at +92 324 4696424 or call the studio. Tell us your program and preferred format (group, one-to-one, or home trainer) and we’ll confirm your batch and start date." },
          ].map((f) => (
            <details key={f.q} className="group rounded-2xl border border-neutral-200 bg-white px-6 py-4 shadow-sm">
              <summary className="cursor-pointer list-none font-bold text-neutral-900 marker:hidden">
                <span className="flex items-center justify-between gap-4">
                  {f.q}
                  <span className="text-red-700 transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-neutral-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="rounded-3xl bg-red-700 px-8 py-12 text-center text-white">
          <h2 className="font-display text-5xl leading-none">Start your journey today</h2>
          <p className="mx-auto mt-3 max-w-xl text-red-100">
            Join thousands of women who train with Fitness Studio — online or in
            person in Lahore.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/programs"
              className="rounded-full bg-white px-6 py-3 font-semibold text-red-700 hover:bg-red-100"
            >
              Explore Programs
            </Link>
            <a
              href={waLink("Hello Fitness Studio! I want to know more about your programs.")}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
            >
              WhatsApp {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
