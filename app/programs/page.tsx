import { COURSE_DURATION, PROGRAMS } from "@/lib/data";
import ProgramCard from "@/components/ProgramCard";

export default function ProgramsPage() {
  return (
    <div>
      {/* Modern page head */}
      <section className="bg-dots border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
          <p className="inline-block rounded-full bg-calm px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
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

      {/* Editorial grid: feature + tall, three equal, full-width anchor — every row fills completely */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-5 md:grid-cols-6">
          <ProgramCard
            p={PROGRAMS[0]}
            index={0}
            showWhoFor
            className="min-h-[26rem] md:col-span-4"
          />
          <ProgramCard
            p={PROGRAMS[1]}
            index={1}
            showWhoFor
            className="min-h-[26rem] md:col-span-2"
          />
          <ProgramCard
            p={PROGRAMS[2]}
            index={2}
            showWhoFor
            className="min-h-[22rem] md:col-span-2"
          />
          <ProgramCard
            p={PROGRAMS[3]}
            index={3}
            showWhoFor
            className="min-h-[22rem] md:col-span-2"
          />
          <ProgramCard
            p={PROGRAMS[4]}
            index={4}
            showWhoFor
            className="min-h-[22rem] md:col-span-2"
          />
          <ProgramCard
            p={PROGRAMS[5]}
            index={5}
            wide
            showWhoFor
            className="md:col-span-6"
          />
        </div>

        <p className="mt-10 inline-block rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-600">
          More programs are on the way. Use the currency switcher in the header
          (PKR / SAR / AED) to preview prices for another region.
        </p>
      </section>
    </div>
  );
}
