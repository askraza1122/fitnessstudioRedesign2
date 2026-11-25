import Link from "next/link";
import { COURSE_DURATION, PROGRAMS } from "@/lib/data";
import { CoursePriceLine } from "@/components/PriceBlock";

export default function ProgramsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      <h1 className="text-4xl font-extrabold text-neutral-900">Training Programs</h1>
      <p className="mt-3 max-w-3xl leading-relaxed text-neutral-600">
        Six programs, each {COURSE_DURATION} long, taught online and in person in
        Lahore by Ayeesha Muzammil. Prices depend on where you are: visitors in
        Saudi Arabia pay a flat 200 SAR per course, visitors in the UAE pay a
        flat 200 AED, and everywhere else the PKR rates apply.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              <h2 className="text-xl font-bold text-neutral-900 group-hover:text-red-700">
                {p.title}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600">{p.short}</p>
              <p className="mt-3 text-sm text-neutral-500">
                <span className="font-medium text-neutral-700">Who it&apos;s for:</span> {p.whoFor}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
                <p className="text-sm">
                  <CoursePriceLine />
                </p>
                <span className="font-semibold text-red-700 group-hover:underline">
                  View details →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-sm text-neutral-500">
        More programs are on the way. Use the currency switcher in the header
        (PKR / SAR / AED) to preview prices for another region.
      </p>
    </div>
  );
}
