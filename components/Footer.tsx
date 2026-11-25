import Link from "next/link";
import {
  ADDRESS_1,
  ADDRESS_2,
  EMAIL,
  FB_URL,
  IG_URL,
  PHONE_DISPLAY,
  waLink,
} from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-300">
      <div className="mx-auto max-w-7xl px-4 pt-12">
        <p className="font-display text-5xl leading-none text-white md:text-6xl">
          Fitness <span className="text-red-700">Studio</span>
        </p>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.25em] text-red-500">
          By Ayeesha Muzammil · Women-only · Lahore
        </p>
      </div>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="inline-block rounded-lg bg-white p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Fitness Studio" className="h-14 w-auto" />
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            Your Fitness, Your Self-defense. Training women across Pakistan and
            beyond in self-defense, yoga and wellness — led by Ayeesha Muzammil.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">
            Explore
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white">About Ayeesha</Link></li>
            <li><Link href="/programs" className="hover:text-white">Training Programs</Link></li>
            <li><Link href="/shop" className="hover:text-white">Shop</Link></li>
            <li><Link href="/achievements" className="hover:text-white">Achievements</Link></li>
            <li><Link href="/mou-partners" className="hover:text-white">MoU Partners</Link></li>
            <li><Link href="/media" className="hover:text-white">Media &amp; Gallery</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">
            Contact
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>{ADDRESS_1}</li>
            <li>{ADDRESS_2}</li>
            <li>
              <a href={`tel:${PHONE_DISPLAY.replace(/\s/g, "")}`} className="hover:text-white">
                {PHONE_DISPLAY}
              </a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`} className="hover:text-white">
                {EMAIL}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">
            Connect
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={FB_URL} target="_blank" rel="noreferrer" className="hover:text-white">
                Facebook
              </a>
            </li>
            <li>
              <a href={IG_URL} target="_blank" rel="noreferrer" className="hover:text-white">
                Instagram — @fittness_studio25
              </a>
            </li>
            <li>
              <a
                href={waLink("Hello Fitness Studio! I have a question.")}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block rounded-full bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
              >
                Chat on WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-800 py-4 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} Fitness Studio Co., Lahore. All rights reserved.
      </div>
    </footer>
  );
}
