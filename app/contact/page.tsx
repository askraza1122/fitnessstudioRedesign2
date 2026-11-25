"use client";

import { useState } from "react";
import {
  ADDRESS_1,
  ADDRESS_2,
  EMAIL,
  FB_URL,
  IG_URL,
  PHONE_DISPLAY,
  waLink,
} from "@/lib/data";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const send = () => {
    if (!name.trim() || !message.trim()) return;
    window.open(
      waLink(`Hello Fitness Studio! My name is ${name}.\n\n${message}`),
      "_blank"
    );
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      <h1 className="text-4xl font-extrabold text-neutral-900">Contact Us</h1>
      <p className="mt-3 max-w-3xl leading-relaxed text-neutral-600">
        Have questions? Get in touch — we usually reply on WhatsApp the same day.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Visit us</h2>
              <p className="mt-2 leading-relaxed text-neutral-700">{ADDRESS_1}</p>
              <p className="mt-1 leading-relaxed text-neutral-700">{ADDRESS_2}</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Say hello</h2>
              <p className="mt-2 text-neutral-700">
                Phone / WhatsApp:{" "}
                <a href={`tel:${PHONE_DISPLAY.replace(/\s/g, "")}`} className="font-semibold text-red-700 hover:underline">
                  {PHONE_DISPLAY}
                </a>
              </p>
              <p className="mt-1 text-neutral-700">
                Email:{" "}
                <a href={`mailto:${EMAIL}`} className="font-semibold text-red-700 hover:underline">
                  {EMAIL}
                </a>
              </p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Follow us</h2>
              <p className="mt-2">
                <a href={FB_URL} target="_blank" rel="noreferrer" className="font-semibold text-red-700 hover:underline">
                  Facebook
                </a>
                {" · "}
                <a href={IG_URL} target="_blank" rel="noreferrer" className="font-semibold text-red-700 hover:underline">
                  Instagram — @fittness_studio25
                </a>
              </p>
            </div>
            <a
              href={waLink("Hello Fitness Studio! I have a question.")}
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-full bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
            >
              Chat on WhatsApp
            </a>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/training/contact-training.jpg"
            alt="Training at Fitness Studio"
            className="mt-8 w-full rounded-3xl object-cover shadow-sm"
          />
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-extrabold text-neutral-900">Send us a message</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Your message opens in WhatsApp — no account needed.
          </p>
          <div className="mt-5 space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 outline-none focus:border-red-700"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message"
              rows={6}
              className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 outline-none focus:border-red-700"
            />
            <button
              onClick={send}
              className="w-full rounded-full bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
            >
              Send via WhatsApp
            </button>
            {sent && (
              <p className="text-sm font-medium text-green-700">
                WhatsApp opened — your message is ready to send.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
