"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function EnrollmentActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  const setStatus = async (next: string) => {
    setBusy(next);
    setError("");
    const res = await fetch(`/api/admin/enrollments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not update the enrollment.");
      return;
    }
    router.refresh();
  };

  return (
    <div className="flex flex-wrap gap-2">
      {status !== "paid" && status !== "unlocked" && (
        <button
          onClick={() => setStatus("paid")}
          disabled={busy !== null}
          className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {busy === "paid" ? "Saving…" : "Mark paid"}
        </button>
      )}
      {status !== "unlocked" && (
        <button
          onClick={() => setStatus("unlocked")}
          disabled={busy !== null}
          className="rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          {busy === "unlocked" ? "Saving…" : "Unlock course"}
        </button>
      )}
      {status !== "rejected" && (
        <button
          onClick={() => setStatus("rejected")}
          disabled={busy !== null}
          className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
        >
          {busy === "rejected" ? "Saving…" : "Reject"}
        </button>
      )}
      {status === "rejected" && (
        <button
          onClick={() => setStatus("requested")}
          disabled={busy !== null}
          className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:border-red-700 hover:text-red-700 disabled:opacity-50"
        >
          Reopen
        </button>
      )}
      {error && <span className="text-xs font-medium text-red-700">{error}</span>}
    </div>
  );
}

export function OrderActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const setStatus = async (next: string) => {
    if (next === status) return;
    setBusy(true);
    setError("");
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not update the order.");
      return;
    }
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        disabled={busy}
        onChange={(e) => setStatus(e.target.value)}
        className="rounded-lg border border-neutral-300 px-2 py-1.5 text-xs font-medium outline-none focus:border-red-700"
      >
        {["new", "confirmed", "delivered", "cancelled"].map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {error && <span className="text-xs font-medium text-red-700">{error}</span>}
    </div>
  );
}
