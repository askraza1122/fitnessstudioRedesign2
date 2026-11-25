import { MOU_IN_PROCESS, MOU_PARTNERS, MOU_PHOTOS } from "@/lib/data";

export default function MouPartnersPage() {
  return (
    <div>
      {/* Page head */}
      <section className="border-b border-neutral-200 bg-dots">
        <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
          <p className="inline-block rounded-full bg-calm px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
            Partnerships
          </p>
          <h1 className="mt-5 font-display text-6xl leading-[0.95] text-neutral-900 md:text-8xl">
            MoU <span className="text-outline">Partners</span>
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-neutral-600">
            Fitness Studio works with institutions, organisations and media
            partners across Pakistan — through formal memorandums of understanding
            for training, awareness and community programs.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
        <h2 className="font-display text-4xl text-neutral-900">MoU signings</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {MOU_PHOTOS.map((m) => (
            <figure key={m.src} className="group overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.src} alt={m.caption} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
              <figcaption className="p-4 text-sm text-neutral-600">{m.caption}</figcaption>
            </figure>
          ))}
        </div>

        <h2 className="mt-16 font-display text-4xl text-neutral-900">Our partners</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MOU_PARTNERS.map((name) => (
            <div
              key={name}
              className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-calm hover:shadow-md"
            >
              <p className="flex items-center gap-2 font-bold text-neutral-900">
                <span className="h-2 w-2 rounded-full bg-calm" />
                {name}
              </p>
              <p className="mt-1 pl-4 text-sm text-neutral-500">MoU partner</p>
            </div>
          ))}
        </div>

        <h2 className="mt-16 font-display text-4xl text-neutral-900">In process</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MOU_IN_PROCESS.map((name) => (
            <div
              key={name}
              className="rounded-[2rem] border border-dashed border-neutral-300 bg-neutral-50 p-5"
            >
              <p className="font-bold text-neutral-900">{name}</p>
              <p className="mt-1 text-sm text-neutral-500">MoU in process</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
