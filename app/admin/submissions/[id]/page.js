// View one submission (admin)
// Shows the submitted code + parser results + grading status options.

import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import {
  ArrowLeft,
  KeyRound,
  Code2,
  ScanSearch,
  CheckCircle2,
  AlertTriangle,
  ClipboardCheck,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";
import GradeForm from "@/components/GradeForm";

export default function ViewSubmissionPage({ params }) {
  const user = getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/student/dashboard");

  const submission = db
    .prepare(
      `SELECT s.*, u.name AS student_name, u.email AS student_email,
              a.title AS assignment_title, a.language, a.required_keywords
       FROM submissions s
       JOIN users u ON u.id = s.student_id
       JOIN assignments a ON a.id = s.assignment_id
       WHERE s.id = ?`
    )
    .get(Number(params.id));

  if (!submission) notFound();

  const log = db
    .prepare(
      "SELECT * FROM parser_logs WHERE submission_id = ? ORDER BY id DESC LIMIT 1"
    )
    .get(submission.id);

  const messages = log ? log.messages.split("\n") : [];

  // Pick a color for each parser line
  function lineColor(m) {
    if (m.startsWith("OK:")) return "text-emerald-700";
    if (m.startsWith("Missing:") || m.startsWith("Warning:"))
      return "text-red-700";
    return "text-slate-700";
  }

  return (
    <div className="space-y-5">
      <Link
        href="/admin/submissions"
        className="text-sm text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
      >
        <ArrowLeft size={14} />
        Back to submissions
      </Link>

      {/* Submission header */}
      <div className="card">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-semibold text-slate-800">
            {submission.assignment_title}
          </h1>
          <span className="badge badge-blue">{submission.language}</span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          By {submission.student_name} ({submission.student_email})
        </p>
        <p className="text-sm text-slate-500">
          Submitted at {submission.submitted_at}
        </p>
        <p className="text-xs text-slate-500 mt-3 inline-flex items-center gap-1.5">
          <KeyRound size={12} />
          Required keywords:{" "}
          <span className="font-mono text-slate-700">
            {submission.required_keywords || "(none)"}
          </span>
        </p>
      </div>

      {/* Submitted code */}
      <div className="card">
        <h2 className="font-semibold text-slate-800 mb-2 inline-flex items-center gap-2">
          <Code2 size={18} className="text-blue-700" />
          Submitted code
        </h2>
        <pre className="code-area whitespace-pre-wrap">{submission.code}</pre>
      </div>

      {/* Parser result */}
      <div className="card">
        <h2 className="font-semibold text-slate-800 mb-2 inline-flex items-center gap-2">
          <ScanSearch size={18} className="text-blue-700" />
          Parser result
        </h2>
        {!log && <p className="text-sm text-slate-500">No parser log found.</p>}
        {log && (
          <div
            className={
              "rounded-lg border px-4 py-3 " +
              (log.passed
                ? "bg-emerald-50 border-emerald-200"
                : "bg-red-50 border-red-200")
            }
          >
            <p
              className={
                "font-semibold inline-flex items-center gap-1.5 " +
                (log.passed ? "text-emerald-700" : "text-red-700")
              }
            >
              {log.passed ? (
                <>
                  <CheckCircle2 size={16} /> Passed
                </>
              ) : (
                <>
                  <AlertTriangle size={16} /> Issues found
                </>
              )}
            </p>
            <ul className="text-sm mt-2 space-y-1">
              {messages.map((m, i) => (
                <li key={i} className={lineColor(m)}>
                  • {m}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Grading */}
      <div className="card">
        <h2 className="font-semibold text-slate-800 mb-2 inline-flex items-center gap-2">
          <ClipboardCheck size={18} className="text-blue-700" />
          Update status
        </h2>
        <p className="text-sm text-slate-500 mb-3">
          Mark the submission as approved, flagged, or pending review.
        </p>
        <GradeForm
          submissionId={submission.id}
          currentStatus={submission.status}
        />
      </div>
    </div>
  );
}
