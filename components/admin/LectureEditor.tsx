"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type LectureShape = {
  id: string;
  order: number;
  title: string;
  description: string | null;
  videoUrl: string | null;
  isFree: boolean;
};

/**
 * Edit one lecture: title / description / order / Bunny CDN URL, or upload a
 * video file (goes to Bunny Storage — never to the app server). If Bunny is
 * not configured the upload shows the env message from the API instead of
 * failing silently.
 */
export default function LectureEditor({ lecture }: { lecture: LectureShape }) {
  const router = useRouter();
  const [title, setTitle] = useState(lecture.title);
  const [description, setDescription] = useState(lecture.description ?? "");
  const [videoUrl, setVideoUrl] = useState(lecture.videoUrl ?? "");
  const [order, setOrder] = useState(String(lecture.order));
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    const res = await fetch(`/api/admin/lectures/${lecture.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description: description || null,
        videoUrl: videoUrl || null,
        order: parseInt(order, 10),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Could not save the lecture.");
      return;
    }
    setMessage("Saved.");
    router.refresh();
  };

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    setMessage("");
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`/api/admin/lectures/${lecture.id}/upload`, {
      method: "POST",
      body: form,
    });
    const data = await res.json().catch(() => ({}));
    setUploading(false);
    if (!res.ok) {
      setError(data.error || "Upload failed.");
      return;
    }
    setVideoUrl(data.videoUrl);
    setFile(null);
    setMessage(`Uploaded to Bunny CDN: ${data.videoUrl}`);
    router.refresh();
  };

  return (
    <form
      onSubmit={save}
      className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-bold text-neutral-900">
          Lecture {lecture.order}
          {lecture.isFree && (
            <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
              Free
            </span>
          )}
          {!lecture.videoUrl && (
            <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
              No video yet
            </span>
          )}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold text-neutral-600">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-red-700"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-neutral-600">Order</span>
          <input
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            type="number"
            min={1}
            max={99}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-red-700"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-xs font-semibold text-neutral-600">Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-red-700"
        />
      </label>

      <label className="block">
        <span className="text-xs font-semibold text-neutral-600">
          Bunny CDN video URL (paste)
        </span>
        <input
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://FitnessStudio.b-cdn.net/lectures/…"
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-red-700"
        />
      </label>

      <div>
        <span className="text-xs font-semibold text-neutral-600">
          Or upload a video file (to Bunny Storage)
        </span>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
          <button
            type="button"
            onClick={upload}
            disabled={!file || uploading}
            className="rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-700 disabled:opacity-50"
          >
            {uploading ? "Uploading…" : "Upload to Bunny"}
          </button>
        </div>
        {file && (
          <p className="mt-1 text-xs text-neutral-500">
            Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
          </p>
        )}
      </div>

      {error && <p className="text-sm font-medium text-red-700">{error}</p>}
      {message && <p className="break-all text-sm font-medium text-green-700">{message}</p>}

      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-red-700 px-5 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60"
      >
        {busy ? "Saving…" : "Save lecture"}
      </button>
    </form>
  );
}
