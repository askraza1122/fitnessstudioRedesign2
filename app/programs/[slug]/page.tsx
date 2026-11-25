import Link from "next/link";
import { notFound } from "next/navigation";
import { COURSE_DURATION, PROGRAMS, getProgram } from "@/lib/data";
import { PriceBlock } from "@/components/PriceBlock";
import EnrollRequest from "@/components/EnrollRequest";

// Prices are geo-aware (cookie-driven), so render per request, not static.
export const dynamic = "force-dynamic";


export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = getProgram(slug);
  if (!program) notFound();

  const others = PROGRAMS.filter((p) => p.slug !== slug);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-red-50 to-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-2">
          <div>
            <Link href="/programs" className="text-sm font-semibold text-red-700 hover:underline">
              ← All programs
            </Link>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-neutral-900">
              {program.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-neutral-600">{program.short}</p>
            <p className="mt-3 text-neutral-600">
              <span className="font-semibold text-neutral-900">Duration:</span> {COURSE_DURATION}
              {" · "}
              <span className="font-semibold text-neutral-900">Format:</span> Online &amp; in-person (Lahore)
            </p>
            <p className="mt-1 text-sm text-neutral-500">{program.imageNote}</p>
          </div>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={program.image}
              alt={program.title}
              className="w-full rounded-3xl object-cover shadow-xl"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-extrabold text-neutral-900">Who it&apos;s for</h2>
          <p className="mt-3 leading-relaxed text-neutral-700">{program.whoFor}</p>

          <h2 className="mt-10 text-2xl font-extrabold text-neutral-900">
            What you&apos;ll learn
          </h2>
          <ul className="mt-4 space-y-3">
            {program.learn.map((item) => (
              <li key={item} className="flex gap-3 leading-relaxed text-neutral-700">
                <span className="font-bold text-red-700">✓</span>
                {item}
              </li>
            ))}
          </ul>

          {program.photos && program.photos.length > 0 && (
            <>
              <h2 className="mt-10 text-2xl font-extrabold text-neutral-900">
                From real training sessions
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {program.photos.map((ph) => (
                  <figure key={ph.src} className="overflow-hidden rounded-2xl border border-neutral-200 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ph.src} alt={ph.caption} className="aspect-[4/3] w-full object-cover" />
                    <figcaption className="p-2 text-xs text-neutral-600">{ph.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </>
          )}

          {program.videos && program.videos.length > 0 && (
            <>
              <h2 className="mt-10 text-2xl font-extrabold text-neutral-900">
                Watch the training
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {program.videos.map((v) => (
                  <figure key={v.src} className="overflow-hidden rounded-2xl border border-neutral-200 shadow-sm">
                    <video controls preload="metadata" className="w-full" src={v.src}>
                      Your browser does not support the video tag.
                    </video>
                    <figcaption className="p-2 text-xs text-neutral-600">{v.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </>
          )}
        </div>

        <aside>
          <div className="lg:sticky lg:top-24">
            <PriceBlock program={program} />
            <EnrollRequest courseSlug={program.slug} programTitle={program.title} />
            <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-5 text-sm leading-relaxed text-neutral-600 shadow-sm">
              <p className="font-semibold text-neutral-900">How enrollment works</p>
              <p className="mt-2">
                Tap “Enroll via WhatsApp” — your course, duration and price are
                filled in automatically. The Fitness Studio team confirms your
                slot and shares payment and class details.
              </p>
            </div>
          </div>
        </aside>
      </section>

      {/* Other programs */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl font-extrabold text-neutral-900">Other programs</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {others.map((p) => (
              <Link
                key={p.slug}
                href={`/programs/${p.slug}`}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.title} className="h-32 w-full object-cover" />
                <p className="p-3 text-sm font-bold text-neutral-900">{p.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
