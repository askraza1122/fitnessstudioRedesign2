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
 * Edit one lecture: title / description / order / free flag / Bunny CDN URL,
 * or upload a video file (goes to Bunny Storage — never to the app server).
 * Cards start open when a lecture still needs a video, closed when it is
 * done, so the list reads as a checklist. A video preview plays inline so
 * the admin can verify the upload before students see it.
 */
export default function LectureEditor({ lecture }: { lecture: LectureShape }) {
  const router = useRouter();
  const [open, setOpen] = useState(!lecture.videoUrl);
  const [title, setTitle] = useState(lecture.title);
  const [description, setDescription] = useState(lecture.description ?? "");
  const [videoUrl, setVideoUrl] = useState(lecture.videoUrl ?? "");
  const [order, setOrder] = useState(String(lecture.order));
  const [isFree, setIsFree] = useState(lecture.isFree);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const patch = async (body: Record<string, unknown>) => {
    const res = await fetch(`/api/admin/lectures/${lecture.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Could not save the lecture.");
    return data;
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await patch({
        title,
        description: description || null,
        videoUrl: videoUrl || null,
        order: parseInt(order, 10),
        isFree,
      });
      setMessage("Saved.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the lecture.");
    } finally {
      setBusy(false);
    }
  };

  const toggleFree = async () => {
    const next = !isFree;
    setIsFree(next);
    setError("");
    try {
      await patch({ isFree: next });
      setMessage(next ? "Marked as free preview." : "Marked as paid (locked).");
      router.refresh();
    } catch (err) {
      setIsFree(!next);
      setError(err instanceof Error ? err.message : "Could not update.");
    }
  };

  const removeVideo = async () => {
    if (!window.confirm("Remove this lecture's video? Students will see it as missing.")) return;
    setBusy(true);
    setError("");
    try {
      await patch({ videoUrl: null });
      setVideoUrl("");
      setMessage("Video removed.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove the video.");
    } finally {
      setBusy(false);
    }
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
    <div
      className={`overflow-hidden rounded-[1.5rem] border bg-white shadow-sm transition ${
        lecture.videoUrl
          ? "border-neutral-200"
          : "border-amber-300 ring-1 ring-amber-200"
      }`}
    >
      {/* Header — always visible, toggles the editor */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 p-4 text-left hover:bg-neutral-50"
        aria-expanded={open}
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
            lecture.videoUrl ? "bg-calm" : "bg-amber-500"
          }`}
        >
          {lecture.videoUrl ? "✓" : lecture.order}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-bold text-neutral-900">
            Lecture {lecture.order} · {title || lecture.title}
          </span>
          <span className="mt-0.5 flex flex-wrap gap-1.5">
            {isFree ? (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
                Free preview
              </span>
            ) : (
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-600">
                Locked (4–8)
              </span>
            )}
            {lecture.videoUrl ? (
              <span className="rounded-full bg-calm-light px-2 py-0.5 text-xs font-semibold text-calm">
                Video ready
              </span>
            ) : (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                No video yet
              </span>
            )}
          </span>
        </span>
        <span className="shrink-0 text-lg text-neutral-400">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <form onSubmit={save} className="space-y-3 border-t border-neutral-100 p-4">
          {/* Inline preview — verify the video before students see it */}
          {videoUrl && (
            <div>
              <video
                controls
                preload="metadata"
                src={videoUrl}
                className="w-full rounded-xl bg-neutral-900"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-calm hover:underline"
                >
                  Open CDN link ↗
                </a>
                <button
                  type="button"
                  onClick={removeVideo}
                  disabled={busy}
                  className="text-xs font-semibold text-red-700 hover:underline disabled:opacity-50"
                >
                  Remove video
                </button>
              </div>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-neutral-600">Title</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-calm"
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
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-calm"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-semibold text-neutral-600">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-calm"
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
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-calm"
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

          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5">
            <input
              type="checkbox"
              checked={isFree}
              onChange={toggleFree}
              className="h-4 w-4 accent-green-700"
            />
            <span className="text-sm font-medium text-neutral-800">
              Free preview — playable without enrollment
              <span className="block text-xs font-normal text-neutral-500">
                Lectures 1–3 are free by default; toggle this to change it.
              </span>
            </span>
          </label>

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
      )}
    </div>
  );
}
