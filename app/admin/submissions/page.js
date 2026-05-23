// View Submissions page (admin)
// Lists all submissions with student name + assignment + status.

import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";

// Map a status to a colored badge class
function statusBadge(status) {
  if (status === "passed" || status === "approved") return "badge-green";
  if (status === "needs review") return "badge-orange";
  if (status === "flagged") return "badge-red";
  return "badge-gray";
}

export default function AdminSubmissionsPage() {
  const user = getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/student/dashboard");

  // Join submissions with users + assignments
  const rows = db
    .prepare(
      `SELECT s.id, s.status, s.submitted_at,
              u.name AS student_name,
              a.title, a.language
       FROM submissions s
       JOIN users u ON u.id = s.student_id
       JOIN assignments a ON a.id = s.assignment_id
       ORDER BY s.id DESC`
    )
    .all();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="section-title">All Submissions</h1>
        <p className="section-sub">Review student submissions and parser results.</p>
      </div>

      {rows.length === 0 && (
        <div className="card text-slate-500">No submissions yet.</div>
      )}

      {rows.length > 0 && (
        <div className="card !p-0 overflow-hidden">
          <table className="tp-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Assignment</th>
                <th>Language</th>
                <th>Status</th>
                <th>Submitted</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="text-slate-800">{r.student_name}</td>
                  <td className="font-medium text-slate-800">{r.title}</td>
                  <td>
                    <span className="badge badge-blue">{r.language}</span>
                  </td>
                  <td>
                    <span className={`badge ${statusBadge(r.status)}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="text-slate-500">{r.submitted_at}</td>
                  <td>
                    <Link
                      href={`/admin/submissions/${r.id}`}
                      className="text-blue-700 hover:text-blue-900 font-medium inline-flex items-center gap-1"
                    >
                      View
                      <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
