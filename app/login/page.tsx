"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setBusy(false);
    if (res?.error) {
      setError("Incorrect email or password. Please try again.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <p className="inline-block rounded-full bg-calm px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
        Welcome back
      </p>
      <h1 className="mt-4 font-display text-5xl text-neutral-900">Log in</h1>
      <p className="mt-2 text-neutral-600">
        Log in to access your courses and lectures.
      </p>
      <form
        onSubmit={submit}
        className="mt-8 space-y-4 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm"
      >
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
            className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-2.5 outline-none focus:border-calm"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-2.5 outline-none focus:border-calm"
          />
        </div>
        {error && <p className="text-sm font-medium text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800 disabled:opacity-60"
        >
          {busy ? "Logging in…" : "Log in"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-neutral-600">
        New to Fitness Studio?{" "}
        <Link href="/register" className="font-semibold text-red-700 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
