// Admin dashboard
// Shows simple counts for assignments, students, and submissions.

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BookOpen,
  Users,
  FileText,
  PlusCircle,
  ListChecks,
  ArrowRight,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";

export default function AdminDashboard() {
  const user = getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/student/dashboard");

  // Read simple stats from database
  const totalAssignments = db
    .prepare("SELECT COUNT(*) AS c FROM assignments")
    .get().c;
  const totalStudents = db
    .prepare("SELECT COUNT(*) AS c FROM users WHERE role = 'student'")
    .get().c;
  const totalSubmissions = db
    .prepare("SELECT COUNT(*) AS c FROM submissions")
    .get().c;

  // 5 most recent submissions for the panel below
  const recent = db
    .prepare(
      `SELECT s.id, s.status, s.submitted_at,
              u.name AS student_name,
              a.title AS assignment_title
       FROM submissions s
       JOIN users u ON u.id = s.student_id
       JOIN assignments a ON a.id = s.assignment_id
       ORDER BY s.id DESC
       LIMIT 5`
    )
    .all();

  function statusBadge(status) {
    if (status === "passed" || status === "approved") return "badge-green";
    if (status === "needs review") return "badge-orange";
    if (status === "flagged") return "badge-red";
    return "badge-gray";
  }

  // Stat tile config (kept above the JSX for readability)
  const stats = [
    { label: "Assignments", value: totalAssignments, Icon: BookOpen },
    { label: "Students", value: totalStudents, Icon: Users },
    { label: "Submissions", value: totalSubmissions, Icon: FileText },
  ];

  return (
    <div className="space-y-7">
      <div>
        <h1 className="section-title">Admin Dashboard</h1>
        <p className="section-sub">
          Overview of assignments, students and submissions.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  {s.label}
                </p>
                <p className="text-3xl font-semibold text-slate-800 mt-1">
                  {s.value}
                </p>
              </div>
              <span className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                <s.Icon size={18} />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/assignments/new" className="btn btn-primary">
          <PlusCircle size={16} className="mr-1.5" />
          Create Assignment
        </Link>
        <Link href="/admin/assignments" className="btn btn-secondary">
          <ListChecks size={16} className="mr-1.5" />
          Manage Assignments
        </Link>
        <Link href="/admin/submissions" className="btn btn-secondary">
          <FileText size={16} className="mr-1.5" />
          View Submissions
        </Link>
      </div>

      {/* Recent submissions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-800">
            Recent submissions
          </h2>
          <Link
            href="/admin/submissions"
            className="text-sm text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>

        {recent.length === 0 && (
          <div className="card text-slate-500">No submissions yet.</div>
        )}

        {recent.length > 0 && (
          <div className="card !p-0 overflow-hidden">
            <table className="tp-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Assignment</th>
                  <th>Status</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id}>
                    <td className="text-slate-800">{r.student_name}</td>
                    <td className="font-medium text-slate-800">
                      <Link
                        href={`/admin/submissions/${r.id}`}
                        className="hover:text-blue-700"
                      >
                        {r.assignment_title}
                      </Link>
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
    </div>
  );
}
