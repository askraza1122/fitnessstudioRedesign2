import Link from "next/link";
import { COURSE_DURATION, type Program } from "@/lib/data";
import { CoursePriceLine } from "@/components/PriceBlock";

type Props = {
  p: Program;
  index: number;
  className?: string;
  /** Full-width split card (image left, white content right) */
  wide?: boolean;
  showWhoFor?: boolean;
};

export default function ProgramCard({
  p,
  index,
  className = "",
  wide,
  showWhoFor,
}: Props) {
  const num = String(index + 1).padStart(2, "0");

  if (wide) {
    return (
      <Link
        href={`/programs/${p.slug}`}
        className={`group grid overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl md:grid-cols-2 ${className}`}
      >
        <div className="relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.image}
            alt={p.title}
            className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 md:h-full"
          />
          <span className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-700 font-display text-lg text-white shadow-lg">
            {num}
          </span>
          <span className="absolute right-4 top-4 rounded-full bg-red-700 px-3 py-1 text-xs font-bold text-white">
            Women only
          </span>
        </div>
        <div className="flex flex-col justify-center p-7 md:p-10">
          <span className="inline-flex w-fit rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
            {COURSE_DURATION} · Online &amp; in-person
          </span>
          <h3 className="mt-4 font-display text-4xl leading-none text-neutral-900">
            {p.title}
          </h3>
          <p className="mt-3 leading-relaxed text-neutral-600">{p.short}</p>
          {showWhoFor && (
            <p className="mt-3 text-sm text-neutral-500">
              <span className="font-semibold text-neutral-700">
                Who it&apos;s for:
              </span>{" "}
              {p.whoFor}
            </p>
          )}
          <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-5">
            <p className="text-sm">
              <CoursePriceLine />
            </p>
            <span className="font-semibold text-red-700 group-hover:underline">
              View details →
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/programs/${p.slug}`}
      className={`group relative block overflow-hidden rounded-[2rem] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={p.image}
        alt={p.title}
        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
      <span className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-700 font-display text-lg text-white shadow-lg">
        {num}
      </span>
      <span className="absolute right-4 top-4 rounded-full bg-red-700 px-3 py-1 text-xs font-bold text-white">
        Women only
      </span>
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        <span className="inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-neutral-900 backdrop-blur">
          {COURSE_DURATION} · Online &amp; in-person
        </span>
        <h3 className="mt-3 font-display text-3xl leading-none text-white drop-shadow-md">
          {p.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white drop-shadow">
          {p.short}
        </p>
        {showWhoFor && (
          <p className="mt-2 line-clamp-2 text-sm text-white/85">
            <span className="font-semibold text-white">Who it&apos;s for:</span>{" "}
            {p.whoFor}
          </p>
        )}
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
  );
}
