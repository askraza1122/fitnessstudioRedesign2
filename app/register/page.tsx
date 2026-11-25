"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setBusy(false);
      setError(data.error || "Could not create your account. Please try again.");
      return;
    }
    const login = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/dashboard",
    });
    setBusy(false);
    if (login?.error) {
      router.push("/login");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-extrabold text-neutral-900">Create an account</h1>
      <p className="mt-2 text-neutral-600">
        Sign up to enroll in courses and watch your lectures.
      </p>
      <form
        onSubmit={submit}
        className="mt-8 space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="text-sm font-semibold text-neutral-700" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-2.5 outline-none focus:border-red-700"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-neutral-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-2.5 outline-none focus:border-red-700"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-neutral-700" htmlFor="phone">
            Phone <span className="font-normal text-neutral-500">(optional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+92 3XX XXXXXXX"
            className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-2.5 outline-none focus:border-red-700"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-neutral-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-2.5 outline-none focus:border-red-700"
          />
        </div>
        {error && <p className="text-sm font-medium text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800 disabled:opacity-60"
        >
          {busy ? "Creating your account…" : "Create account"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-neutral-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-red-700 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
