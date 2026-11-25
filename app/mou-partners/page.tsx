import { MOU_IN_PROCESS, MOU_PARTNERS, MOU_PHOTOS } from "@/lib/data";

export default function MouPartnersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      <h1 className="text-4xl font-extrabold text-neutral-900">MoU Partners</h1>
      <p className="mt-3 max-w-3xl leading-relaxed text-neutral-600">
        Fitness Studio works with institutions, organisations and media
        partners across Pakistan — through formal memorandums of understanding
        for training, awareness and community programs.
      </p>

      <h2 className="mt-12 text-2xl font-extrabold text-neutral-900">MoU signings</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {MOU_PHOTOS.map((m) => (
          <figure key={m.src} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.src} alt={m.caption} className="aspect-[4/3] w-full object-cover" />
            <figcaption className="p-3 text-sm text-neutral-600">{m.caption}</figcaption>
          </figure>
        ))}
      </div>

      <h2 className="mt-12 text-2xl font-extrabold text-neutral-900">Our partners</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MOU_PARTNERS.map((name) => (
          <div
            key={name}
            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <p className="font-bold text-neutral-900">{name}</p>
            <p className="mt-1 text-sm text-neutral-500">MoU partner</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-2xl font-extrabold text-neutral-900">In process</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MOU_IN_PROCESS.map((name) => (
          <div
            key={name}
            className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-5"
          >
            <p className="font-bold text-neutral-900">{name}</p>
            <p className="mt-1 text-sm text-neutral-500">MoU in process</p>
          </div>
        ))}
      </div>
    </div>
  );
}
