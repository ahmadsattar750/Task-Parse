"use client";
// Login page (works for both students and admin)
// We send email + password to /api/auth/login. The API decides the role
// from the database and sets a cookie.

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }

    // Send the user to the right dashboard based on their role
    if (data.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/student/dashboard");
    }
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto pt-6">
      <div className="card">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-slate-800">
            Welcome back
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Login to continue to Task Parse.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input mt-1"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input mt-1"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-slate-600 mt-5">
          New here?{" "}
          <Link
            href="/signup"
            className="text-blue-700 hover:text-blue-900 font-medium"
          >
            Create an account
          </Link>
        </p>

        <div className="mt-5 rounded-lg bg-blue-50/60 border border-blue-100 px-3 py-3 text-xs text-slate-600">
          <p className="font-medium text-slate-700 mb-1">Demo accounts</p>
          <p>Admin · admin@taskparse.com / admin123</p>
          <p>Student · ali@student.com / ali123</p>
        </div>
      </div>
    </div>
  );
}
