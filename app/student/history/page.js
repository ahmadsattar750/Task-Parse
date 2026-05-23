// Submission history page (student)
// Lists every submission made by the logged-in student.

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";

// Map a status to a colored badge class
function statusBadge(status) {
  if (status === "passed" || status === "approved") return "badge-green";
  if (status === "needs review") return "badge-orange";
  if (status === "flagged") return "badge-red";
  return "badge-gray";
}

export default function StudentHistoryPage() {
  const user = getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "student") redirect("/admin/dashboard");

  // Join submissions with assignments to display the assignment title
  const rows = db
    .prepare(
      `SELECT s.id, s.status, s.submitted_at, a.title, a.language
       FROM submissions s
       JOIN assignments a ON a.id = s.assignment_id
       WHERE s.student_id = ?
       ORDER BY s.id DESC`
    )
    .all(user.id);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="section-title">My Submissions</h1>
        <p className="section-sub">
          A list of every assignment you have submitted.
        </p>
      </div>

      {rows.length === 0 && (
        <div className="card text-slate-500">
          You have not submitted anything yet.
        </div>
      )}

      {rows.length > 0 && (
        <div className="card !p-0 overflow-hidden">
          <table className="tp-table">
            <thead>
              <tr>
                <th>Assignment</th>
                <th>Language</th>
                <th>Status</th>
                <th>Submitted at</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
