// Assignment details + submission page
// Shows the assignment text and a code editor textarea.
// Includes "Run Parser" (check before submission) and "Submit" buttons.

import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, KeyRound, Code2, History } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";
import SubmissionForm from "@/components/SubmissionForm";

// Map a submission status to a colored badge class
function statusBadge(status) {
  if (status === "passed" || status === "approved") return "badge-green";
  if (status === "needs review") return "badge-orange";
  if (status === "flagged") return "badge-red";
  return "badge-gray";
}

export default function AssignmentDetailsPage({ params }) {
  const user = getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "student") redirect("/admin/dashboard");

  const assignment = db
    .prepare("SELECT * FROM assignments WHERE id = ?")
    .get(Number(params.id));

  if (!assignment) notFound();

  // Show previous submissions of THIS student for THIS assignment
  const previous = db
    .prepare(
      "SELECT * FROM submissions WHERE assignment_id = ? AND student_id = ? ORDER BY id DESC"
    )
    .all(assignment.id, user.id);

  return (
    <div className="space-y-5">
      <Link
        href="/student/dashboard"
        className="text-sm text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
      >
        <ArrowLeft size={14} />
        Back to dashboard
      </Link>

      {/* Assignment details */}
      <div className="card">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-semibold text-slate-800">
            {assignment.title}
          </h1>
          <span className="badge badge-blue">{assignment.language}</span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Deadline: {assignment.deadline || "No deadline"}
        </p>

        <p className="text-slate-700 whitespace-pre-wrap mt-4 leading-relaxed">
          {assignment.description}
        </p>

        {assignment.required_keywords && (
          <div className="mt-5 rounded-lg bg-blue-50/60 border border-blue-100 px-3 py-3">
            <p className="text-xs font-medium text-slate-700 mb-1 inline-flex items-center gap-1.5">
              <KeyRound size={12} />
              Required keywords
            </p>
            <p className="text-sm font-mono text-slate-700">
              {assignment.required_keywords}
            </p>
          </div>
        )}
      </div>

      {/* Submission form */}
      <div className="card">
        <h2 className="font-semibold text-slate-800 mb-3 inline-flex items-center gap-2">
          <Code2 size={18} className="text-blue-700" />
          Submit your code
        </h2>
        <SubmissionForm assignmentId={assignment.id} />
      </div>

      {/* Previous attempts */}
      <div className="card">
        <h2 className="font-semibold text-slate-800 mb-3 inline-flex items-center gap-2">
          <History size={18} className="text-blue-700" />
          Your previous attempts
        </h2>
        {previous.length === 0 && (
          <p className="text-sm text-slate-500">No submissions yet.</p>
        )}
        <ul className="space-y-2">
          {previous.map((s) => (
            <li
              key={s.id}
              className="border border-slate-200 rounded-lg p-3 text-sm flex items-center justify-between"
            >
              <span className="text-slate-700">
                Submitted at {s.submitted_at}
              </span>
              <span className={`badge ${statusBadge(s.status)}`}>
                {s.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
