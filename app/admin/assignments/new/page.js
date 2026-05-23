"use client";
// Create Assignment page (admin)
// A simple form that posts to /api/assignments

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

const LANGUAGES = [
  "C",
  "C++",
  "Java",
  "Python",
  "JavaScript",
  "HTML",
  "CSS",
  "Tailwind CSS",
];

export default function NewAssignmentPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("C++");
  const [deadline, setDeadline] = useState("");
  const [keywords, setKeywords] = useState("");

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);

    const res = await fetch("/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        language,
        deadline,
        required_keywords: keywords,
      }),
    });

    const data = await res.json();
    setBusy(false);

    if (!res.ok) {
      setError(data.error || "Could not create assignment");
      return;
    }

    router.push("/admin/assignments");
    router.refresh();
  }

  return (
    <div className="max-w-2xl space-y-5">
      <Link
        href="/admin/assignments"
        className="text-sm text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
      >
        <ArrowLeft size={14} />
        Back to assignments
      </Link>

      <div>
        <h1 className="section-title">Create Assignment</h1>
        <p className="section-sub">
          Set the rules and required keywords for the parser to check.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input mt-1"
            placeholder="e.g. Hello World in C++"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input mt-1"
            placeholder="Explain what the student needs to do..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="input mt-1"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="input mt-1"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Required keywords (comma-separated)
          </label>
          <input
            type="text"
            placeholder="main, #include, iostream, cout"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="input mt-1"
          />
          <p className="text-xs text-slate-500 mt-1">
            The parser will check for these in the student's code.
          </p>
        </div>

        {error && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <button type="submit" disabled={busy} className="btn btn-primary">
            <Save size={15} className="mr-1.5" />
            {busy ? "Saving..." : "Create Assignment"}
          </button>
          <Link href="/admin/assignments" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
