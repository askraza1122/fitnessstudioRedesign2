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

const socialIcon =
  "flex h-10 w-10 items-center justify-center rounded-full bg-red-700 text-white transition hover:bg-neutral-900";

export default function Footer() {
  return (
    <footer className="border-t-4 border-red-700 bg-white text-neutral-700">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-14">
        <p className="kicker">Fitness Studio · Lahore</p>
        <p className="mt-3 font-display text-[13vw] leading-[0.9] text-neutral-900 sm:text-7xl md:text-8xl">
          Fitness <span className="text-red-700">Studio</span>
        </p>
        <p className="mt-3 max-w-xl font-accent text-2xl italic text-neutral-500">
          Your fitness, your self-defense.
        </p>

        <div className="mt-12 grid gap-10 md:grid-cols-4">
          <div>
            <div className="inline-block rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Fitness Studio" className="h-14 w-auto" />
            </div>
            <p className="mt-4 text-sm leading-relaxed">
              Training women across Pakistan and beyond in self-defense, yoga
              and wellness — led by Ayeesha Muzammil.
            </p>
            <div className="mt-5 flex gap-3">
              <a href={FB_URL} target="_blank" rel="noreferrer" aria-label="Facebook" className={socialIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href={IG_URL} target="_blank" rel="noreferrer" aria-label="Instagram" className={socialIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href={waLink("Hello Fitness Studio! I have a question.")}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className={socialIcon}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm font-medium">
              <li><Link href="/about" className="hover:text-red-700">About Ayeesha</Link></li>
              <li><Link href="/programs" className="hover:text-red-700">Training Programs</Link></li>
              <li><Link href="/shop" className="hover:text-red-700">Shop</Link></li>
              <li><Link href="/achievements" className="hover:text-red-700">Achievements</Link></li>
              <li><Link href="/mou-partners" className="hover:text-red-700">MoU Partners</Link></li>
              <li><Link href="/media" className="hover:text-red-700">Media &amp; Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900">
              Contact
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>{ADDRESS_1}</li>
              <li>{ADDRESS_2}</li>
              <li>
                <a href={`tel:${PHONE_DISPLAY.replace(/\s/g, "")}`} className="font-semibold text-neutral-900 hover:text-red-700">
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className="hover:text-red-700">
                  {EMAIL}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900">
              Start today
            </h3>
            <p className="mt-4 text-sm leading-relaxed">
              Every course is 4 weeks. Message us on WhatsApp and we&apos;ll
              confirm your batch and start date.
            </p>
            <a
              href={waLink("Hello Fitness Studio! I want to know more about your programs.")}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Chat on WhatsApp →
            </a>
          </div>
        </div>
      </div>

      <div className="bg-red-700 py-4 text-center text-sm font-medium text-white">
        © {new Date().getFullYear()} Fitness Studio Co., Lahore · Women-only ·
        All rights reserved.
      </div>
    </footer>
  );
}
