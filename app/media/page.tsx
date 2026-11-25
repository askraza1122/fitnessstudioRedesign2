import {
  EVENT_PHOTOS,
  POSTERS,
  TIKTOK_LINKS,
  TRAINING_VIDEOS,
  TV_INTERVIEW_VIDEO,
  YOUTUBE_PLAYLIST_URL,
} from "@/lib/data";

export default function MediaPage() {
  const upcoming = POSTERS.filter((p) => p.upcoming);
  const archive = POSTERS.filter((p) => !p.upcoming);

  return (
    <div>
      {/* Page head */}
      <section className="border-b border-neutral-200 bg-dots">
        <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
          <p className="inline-block rounded-full bg-calm px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
            Media &amp; Gallery
          </p>
          <h1 className="mt-5 font-display text-6xl leading-[0.95] text-neutral-900 md:text-8xl">
            Media &amp; <span className="text-outline">Gallery</span>
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-neutral-600">
            Photos, posters and videos from events, TV appearances and training
            sessions.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
        {/* Videos */}
        <h2 className="font-display text-4xl text-neutral-900">Videos</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <figure className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm">
            <video controls preload="metadata" className="w-full" src={TV_INTERVIEW_VIDEO.src}>
              Your browser does not support the video tag.
            </video>
            <figcaption className="p-4 text-sm text-neutral-600">
              {TV_INTERVIEW_VIDEO.caption}
            </figcaption>
          </figure>
          {TRAINING_VIDEOS.map((v) => (
            <figure key={v.src} className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm">
              <video controls preload="metadata" className="w-full" src={v.src}>
                Your browser does not support the video tag.
              </video>
              <figcaption className="p-4 text-sm text-neutral-600">{v.caption}</figcaption>
            </figure>
          ))}
        </div>

        {/* Social links */}
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={YOUTUBE_PLAYLIST_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-red-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-800"
          >
            YouTube playlist →
          </a>
          {TIKTOK_LINKS.map((url, i) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700"
            >
              TikTok clip {i + 1} →
            </a>
          ))}
        </div>

        {/* Events */}
        <h2 className="mt-16 font-display text-4xl text-neutral-900">Events &amp; speaking</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EVENT_PHOTOS.map((e) => (
            <figure key={e.src} className="group overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={e.src} alt={e.caption} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
              <figcaption className="p-4 text-sm text-neutral-600">{e.caption}</figcaption>
            </figure>
          ))}
        </div>

        {/* Posters */}
        <h2 className="mt-16 font-display text-4xl text-neutral-900">Event posters</h2>
        {upcoming.length > 0 && (
          <>
            <p className="mt-3 font-semibold text-calm">Upcoming</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((p) => (
                <figure key={p.src} className="group overflow-hidden rounded-[2rem] border-2 border-calm bg-white shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.src} alt={p.caption} className="w-full object-cover transition duration-500 group-hover:scale-105" />
                  <figcaption className="p-4 text-sm text-neutral-600">{p.caption}</figcaption>
                </figure>
              ))}
            </div>
          </>
        )}
        <p className="mt-10 font-semibold text-neutral-700">Archive (2023)</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {archive.map((p) => (
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
