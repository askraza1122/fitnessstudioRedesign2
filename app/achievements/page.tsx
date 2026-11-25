import {
  AWARD_PHOTOS,
  PRESS_PHOTOS,
  RECOGNITION_GRAPHICS,
  YOUTUBE_IDS,
  YOUTUBE_PLAYLIST_URL,
} from "@/lib/data";

export default function AchievementsPage() {
  return (
    <div>
      {/* Page head */}
      <section className="border-b border-neutral-200 bg-dots">
        <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
          <p className="inline-block rounded-full bg-calm px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
            Awards · Media · Recognition
          </p>
          <h1 className="mt-5 font-display text-6xl leading-[0.95] text-neutral-900 md:text-8xl">
            Awards &amp;{" "}
            <span className="text-outline">Recognition</span>
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-neutral-600">
            Awards, recognition and media coverage earned by Ayeesha Muzammil and
            Fitness Studio — in Pakistan and around the world.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
        {/* Recognition graphics */}
        <h2 className="font-display text-4xl text-neutral-900">Recognition</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RECOGNITION_GRAPHICS.map((g) => (
            <figure key={g.src} className="group overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.src} alt={g.caption} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
              <figcaption className="p-4 text-sm text-neutral-600">{g.caption}</figcaption>
            </figure>
          ))}
          <div className="flex flex-col justify-center rounded-[2rem] bg-red-700 p-6 text-white">
            <p className="font-display text-2xl">Also awarded</p>
            <p className="mt-2 leading-relaxed text-red-100">
              National Summit Award · Pride of Pakistan · Womenza Award · She
              Inspires Award (Bolton, UK) · PNY &amp; Dynamic Awards (Govt. of
              Pakistan) · 101 CEO Awards · Heritage Global Mentorship Award
              (Africa) · Youth Parliament Award · Inspiring Woman by University
              of Conquest USA · Girl Guide Human Life Saving awards
            </p>
          </div>
        </div>

        {/* Awards gallery */}
        <h2 className="mt-16 font-display text-4xl text-neutral-900">Awards gallery</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AWARD_PHOTOS.map((a) => (
            <figure key={a.src} className="group overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.src} alt={a.caption} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
              <figcaption className="p-4 text-sm text-neutral-600">{a.caption}</figcaption>
            </figure>
          ))}
        </div>

        {/* TV interviews */}
        <h2 className="mt-16 font-display text-4xl text-neutral-900">TV interviews</h2>
        <p className="mt-3 text-neutral-600">
          Interviews and features from the WhatsApp archive.{" "}
          <a
            href={YOUTUBE_PLAYLIST_URL}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-red-700 hover:underline"
          >
            Watch the full playlist on YouTube →
          </a>
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {YOUTUBE_IDS.map((id) => (
            <div key={id} className="overflow-hidden rounded-[2rem] shadow-sm">
              <iframe
                className="aspect-video w-full"
                src={`https://www.youtube-nocookie.com/embed/${id}`}
                title="Fitness Studio TV interview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ))}
        </div>

        {/* Press clippings */}
        <h2 className="mt-16 font-display text-4xl text-neutral-900">Press coverage</h2>
        <p className="mt-3 text-neutral-600">
          Newspaper clippings — shown as images; some are in Urdu. Also covered
          by: Connected Women Pakistan, Qasim Ali Shah Foundation, Parliament
          Diaries, Naway-e-Pakistan (Canada), Shadab, Urdu Global News, Humari
          News.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRESS_PHOTOS.map((p) => (
            <figure key={p.src} className="group overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.caption} className="w-full object-cover transition duration-500 group-hover:scale-105" />
              <figcaption className="p-4 text-sm text-neutral-600">{p.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
