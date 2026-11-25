import Link from "next/link";
import { COURSE_DURATION, PROGRAMS } from "@/lib/data";
import { CoursePriceLine } from "@/components/PriceBlock";

const SPANS = [
  "md:col-span-4",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-3",
  "md:col-span-3",
];

export default function ProgramsPage() {
  return (
    <div>
      {/* Modern page head */}
      <section className="bg-dots border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
          <p className="inline-block rounded-full bg-red-700 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
            6 programs · {COURSE_DURATION} each
          </p>
          <h1 className="mt-5 font-display text-6xl leading-[0.95] text-neutral-900 md:text-8xl">
            Training <span className="text-outline-red">Programs</span>
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-neutral-600">
            Six programs, each {COURSE_DURATION} long, taught online and in
            person in Lahore by Ayeesha Muzammil. Prices depend on where you
            are: visitors in Saudi Arabia pay a flat 200 SAR per course,
            visitors in the UAE pay a flat 200 AED, and everywhere else the PKR
            rates apply.
          </p>
        </div>
      </section>

      {/* Bento grid */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-5 md:grid-cols-6">
          {PROGRAMS.map((p, i) => (
            <Link
              key={p.slug}
              href={`/programs/${p.slug}`}
              className={`group relative block min-h-[21rem] overflow-hidden rounded-[2rem] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${SPANS[i] ?? "md:col-span-2"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt={p.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <span className="absolute left-5 top-4 font-display text-5xl text-white/80">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="absolute right-4 top-4 rounded-full bg-red-700 px-3 py-1 text-xs font-bold text-white">
                Women only
              </span>
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                <span className="inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-neutral-900 backdrop-blur">
                  {COURSE_DURATION} · Online &amp; in-person
                </span>
                <h2 className="mt-3 font-display text-3xl leading-none text-white">
                  {p.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/85">
                  {p.short}
                </p>
                <p className="mt-2 text-sm text-white/80">
                  <span className="font-semibold text-white">Who it&apos;s for:</span> {p.whoFor}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-white/25 pt-4">
                  <p className="text-sm text-white">
                    <CoursePriceLine />
                  </p>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg text-red-700 transition group-hover:bg-red-700 group-hover:text-white">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-10 inline-block rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-600">
          More programs are on the way. Use the currency switcher in the header
          (PKR / SAR / AED) to preview prices for another region.
        </p>
      </section>
    </div>
  );
}
