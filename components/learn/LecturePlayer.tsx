"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  lectureId: string;
  courseSlug: string;
  lectureOrder: number;
  totalLectures: number;
  videoUrl: string | null;
  title: string;
  description: string | null;
  isCompleted: boolean;
};

export default function LecturePlayer({
  lectureId,
  courseSlug,
  lectureOrder,
  totalLectures,
  videoUrl,
  title,
  description,
  isCompleted,
}: Props) {
  const router = useRouter();
  const [done, setDone] = useState(isCompleted);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const markComplete = async () => {
    setBusy(true);
    setError("");
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lectureId }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not save your progress.");
      return;
    }
    setDone(true);
    router.refresh();
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-neutral-900">
        Lecture {lectureOrder}: {title}
      </h1>
      {description && <p className="mt-2 leading-relaxed text-neutral-600">{description}</p>}

      <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-black shadow-sm">
        {videoUrl ? (
          <video
            key={videoUrl}
            controls
            preload="metadata"
            className="aspect-video w-full"
            src={videoUrl}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="flex aspect-video w-full flex-col items-center justify-center bg-neutral-900 px-6 text-center">
            <p className="text-2xl font-bold text-white">Video coming soon</p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-300">
              This lecture&apos;s video hasn&apos;t been uploaded yet. The
              studio will add it from the admin panel — check back soon.
            </p>
          </div>
        )}
      </div>

      {error && <p className="mt-3 text-sm font-medium text-red-700">{error}</p>}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {lectureOrder > 1 && (
          <Link
            href={`/learn/${courseSlug}/${lectureOrder - 1}`}
            className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:border-red-700 hover:text-red-700"
          >
            ← Previous lecture
          </Link>
        )}
        {lectureOrder < totalLectures && (
          <Link
            href={`/learn/${courseSlug}/${lectureOrder + 1}`}
            className="rounded-full bg-red-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-800"
          >
            Next lecture →
          </Link>
        )}
        {done ? (
          <span className="rounded-full bg-green-100 px-5 py-2.5 text-sm font-semibold text-green-800">
            ✓ Completed
          </span>
        ) : (
          <button
            onClick={markComplete}
            disabled={busy}
            className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700 disabled:opacity-60"
          >
            {busy ? "Saving…" : "Mark as complete"}
          </button>
        )}
        <Link
          href={`/learn/${courseSlug}`}
          className="rounded-full px-3 py-2.5 text-sm font-medium text-neutral-600 hover:text-red-700"
        >
          All lectures
        </Link>
      </div>
    </div>
  );
}
