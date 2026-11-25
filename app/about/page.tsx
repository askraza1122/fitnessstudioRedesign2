import Link from "next/link";
import {
  BOOK_PHOTOS,
  RECOGNITION_GRAPHICS,
  TV_INTERVIEW_VIDEO,
  waLink,
} from "@/lib/data";

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-red-50 to-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-red-700">
              About Ayeesha
            </p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-neutral-900">
              A trainer, a fighter, and a voice for women&apos;s safety
            </h1>
            <p className="mt-4 leading-relaxed text-neutral-700">
              Ayeesha Muzammil is the founder and CEO of Fitness Studio Co.,
              Lahore. She is Pakistan&apos;s first certified Para-Taekwondo
              instructor — a Kukkiwon black belt from South Korea — and a
              certified yoga trainer from the University of California.
            </p>
          </div>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/IMG-20261114-WA0044-enhanced.webp"
              alt="Ayeesha Muzammil"
              className="w-full rounded-3xl object-cover shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Bio */}
      <section className="mx-auto max-w-4xl px-4 py-14">
        <h2 className="text-2xl font-extrabold text-neutral-900">Her story</h2>
        <div className="mt-4 space-y-4 leading-relaxed text-neutral-700">
          <p>
            Ayeesha founded Fitness Studio after 14 years of marriage — with a
            mission that was sparked by the APS incident and her father&apos;s
            belief: <em>“My children should never depend on anyone for their
            safety.”</em>
          </p>
          <p>
            Since then she has trained thousands of girls and working women in
            self-defense and anti-harassment — in person and online — and has
            conducted hundreds of workshops for corporates, schools and
            communities across Pakistan and abroad.
          </p>
          <p>
            She is the Vice President of Integral Martial Arts, the first
            female ambassador from the Muslim world for Taekwondo for
            special-needs children, and holds international certifications from
            Canada. She is also Pakistan&apos;s first female author of a
            self-defense book.
          </p>
          <p>
            Her work has been recognised with the National Summit Award, the
            Pride of Pakistan award, the Womenza Award, the She Inspires Award
            (Bolton, UK), PNY &amp; Dynamic Awards from the Government of
            Pakistan, and the 101 CEO Awards — and featured on Voice of America,
            DW, Discover Pakistan, 92 News, GNN and many other channels.
          </p>
        </div>

        <h2 className="mt-12 text-2xl font-extrabold text-neutral-900">Credentials</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            "Pakistan's first certified Para-Taekwondo instructor — Kukkiwon black belt, South Korea",
            "Certified yoga trainer — University of California",
            "Vice President, Integral Martial Arts",
            "First female ambassador from the Muslim world for Taekwondo for special-needs children",
            "International certifications from Canada",
            "Pakistan's first female author of a self-defense book",
            "Heritage Global Mentorship Award (Africa)",
            "Award by Qasim Ali Shah Foundation",
          ].map((c) => (
            <li key={c} className="rounded-xl border border-neutral-200 bg-white p-4 text-sm leading-relaxed shadow-sm">
              <span className="mr-2 font-bold text-red-700">✓</span>
              {c}
            </li>
          ))}
        </ul>
      </section>

      {/* Recognition graphics */}
      <section className="bg-neutral-50 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl font-extrabold text-neutral-900">Recognition</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RECOGNITION_GRAPHICS.map((g) => (
              <figure key={g.src} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.src} alt={g.caption} className="aspect-[4/3] w-full object-cover" />
                <figcaption className="p-3 text-sm text-neutral-600">{g.caption}</figcaption>
              </figure>
            ))}
            <div className="flex flex-col justify-center rounded-2xl bg-red-700 p-6 text-white">
              <p className="text-2xl font-extrabold">5,000+ women trained</p>
              <p className="mt-2 text-red-100">
                300+ workshops · 12+ MoU partners · 8 media features
              </p>
              <Link
                href="/achievements"
                className="mt-4 font-semibold text-white underline"
              >
                See all achievements →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Book */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="text-2xl font-extrabold text-neutral-900">Pakistan&apos;s first female author of a self-defense book</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-neutral-700">
          Ayeesha wrote the first self-defense book by a woman in Pakistan —
          putting practical safety knowledge into the hands of girls and women
          everywhere.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {BOOK_PHOTOS.map((b) => (
            <figure key={b.src} className="overflow-hidden rounded-2xl border border-neutral-200 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.src} alt={b.caption} className="aspect-[4/3] w-full object-cover" />
              <figcaption className="p-3 text-sm text-neutral-600">{b.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* TV interview */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <h2 className="text-2xl font-extrabold text-neutral-900">Watch: TV interview on women&apos;s safety</h2>
        <div className="mt-6 overflow-hidden rounded-2xl shadow-lg">
          <video controls preload="metadata" className="w-full" src={TV_INTERVIEW_VIDEO.src}>
            Your browser does not support the video tag.
          </video>
        </div>
        <p className="mt-3 text-sm text-neutral-500">{TV_INTERVIEW_VIDEO.caption}</p>
        <div className="mt-8 text-center">
          <Link
            href="/programs"
            className="inline-block rounded-full bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
          >
            Train with Ayeesha →
          </Link>
          <a
            href={waLink("Hello Fitness Studio! I want to know more about Ayeesha's programs.")}
            target="_blank"
            rel="noreferrer"
            className="ml-3 inline-block rounded-full bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
          >
            WhatsApp us
          </a>
        </div>
      </section>
    </div>
  );
}
