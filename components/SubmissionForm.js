"use client";
// Form used by students to submit code.
// Two buttons:
//   - "Run Parser" -> calls /api/parser/check (does NOT save anything)
//   - "Submit Final" -> calls /api/submissions (saves submission + parser result)

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Play,
  Send,
  CheckCircle2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export default function SubmissionForm({ assignmentId }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [submittedMsg, setSubmittedMsg] = useState("");

  async function runParser() {
    setBusy(true);
    setSubmittedMsg("");

    const res = await fetch("/api/parser/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignmentId, code }),
    });
    const data = await res.json();
    setBusy(false);
    setResult(data);
  }

  async function submitFinal() {
    setBusy(true);
    setSubmittedMsg("");

    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignmentId, code }),
    });
    const data = await res.json();
    setBusy(false);

    if (!res.ok) {
      setSubmittedMsg(data.error || "Submission failed");
      return;
    }

    setResult(data.parser);
    setSubmittedMsg("Your code has been submitted successfully.");
    router.refresh();
  }

  // Each parser message starts with "OK:" or "Missing:" or general text
  function messageStyle(msg) {
    if (msg.startsWith("OK:")) return "text-emerald-700";
    if (msg.startsWith("Missing:") || msg.startsWith("Warning:"))
      return "text-red-700";
    return "text-slate-700";
  }

  return (
    <div>
      <textarea
        className="code-area"
        placeholder="// Write your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <div className="flex flex-wrap gap-2 mt-3">
        <button
          type="button"
          onClick={runParser}
          disabled={busy || code.trim().length === 0}
          className="btn btn-secondary"
        >
          <Play size={15} className="mr-1.5" />
          Run Parser Check
        </button>
        <button
          type="button"
          onClick={submitFinal}
          disabled={busy || code.trim().length === 0}
          className="btn btn-primary"
        >
          <Send size={15} className="mr-1.5" />
          Submit Final
        </button>
      </div>

      {submittedMsg && (
        <div className="mt-4 inline-flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          <CheckCircle size={15} />
          {submittedMsg}
        </div>
      )}

      {result && (
        <div
          className={
            "mt-4 rounded-lg border px-4 py-4 " +
            (result.passed
              ? "bg-emerald-50 border-emerald-200"
              : "bg-red-50 border-red-200")
          }
        >
          <p
            className={
              "font-semibold mb-2 inline-flex items-center gap-1.5 " +
              (result.passed ? "text-emerald-700" : "text-red-700")
            }
          >
            {result.passed ? (
              <>
                <CheckCircle2 size={16} /> All checks passed
              </>
            ) : (
              <>
                <AlertTriangle size={16} /> Some checks failed
              </>
            )}
          </p>
          <ul className="text-sm space-y-1">
            {result.messages.map((m, i) => (
              <li key={i} className={messageStyle(m)}>
                • {m}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
