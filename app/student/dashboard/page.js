// Student Dashboard
// Shows the list of all assignments the student can work on.

import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, FileCheck2, Calendar, ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";

export default function StudentDashboard() {
  const user = getCurrentUser();
  // Only logged-in students can access this page
  if (!user) redirect("/login");
  if (user.role !== "student") redirect("/admin/dashboard");

  // Read assignments from database (newest first)
  const assignments = db
    .prepare("SELECT * FROM assignments ORDER BY id DESC")
    .all();

  // Count this student's submissions for the small stat card
  const submissionCount = db
    .prepare("SELECT COUNT(*) AS c FROM submissions WHERE student_id = ?")
    .get(user.id).c;

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <h1 className="section-title">Welcome, {user.name}</h1>
        <p className="section-sub">Here are your available assignments.</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Available Assignments
              </p>
              <p className="text-3xl font-semibold text-slate-800 mt-1">
                {assignments.length}
              </p>
            </div>
            <span className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
              <BookOpen size={18} />
            </span>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                My Submissions
              </p>
              <p className="text-3xl font-semibold text-slate-800 mt-1">
                {submissionCount}
              </p>
            </div>
            <span className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
              <FileCheck2 size={18} />
            </span>
          </div>
        </div>
      </div>

      {/* Assignment list */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">
          Assignments
        </h2>

        {assignments.length === 0 && (
          <div className="card text-slate-500">No assignments yet.</div>
        )}

        <div className="grid gap-3">
          {assignments.map((a) => (
            <div
              key={a.id}
              className="card card-hover flex items-start md:items-center justify-between gap-4 flex-col md:flex-row"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-slate-800">{a.title}</h3>
                  <span className="badge badge-blue">{a.language}</span>
                </div>
                <p className="text-sm text-slate-500 inline-flex items-center gap-1.5">
                  <Calendar size={14} />
                  Deadline: {a.deadline || "No deadline"}
                </p>
              </div>
              <Link
                href={`/student/assignments/${a.id}`}
                className="btn btn-primary"
              >
                Open
                <ArrowRight size={15} className="ml-1.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
