// Manage Assignments page (admin)
// Lists every assignment with options to delete.

import Link from "next/link";
import { redirect } from "next/navigation";
import { PlusCircle, Calendar, KeyRound } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";
import DeleteAssignmentButton from "@/components/DeleteAssignmentButton";

export default function ManageAssignmentsPage() {
  const user = getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/student/dashboard");

  //CRUD Read HERE
  const assignments = db
    .prepare("SELECT * FROM assignments ORDER BY id DESC")
    .all();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Manage Assignments</h1>
          <p className="section-sub">Create or remove assignments.</p>
        </div>
        <Link href="/admin/assignments/new" className="btn btn-primary">
          <PlusCircle size={16} className="mr-1.5" />
          New Assignment
        </Link>
      </div>

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
              <p className="text-xs text-slate-500 mt-1 font-mono inline-flex items-center gap-1.5">
                <KeyRound size={12} />
                {a.required_keywords || "(no required keywords)"}
              </p>
            </div>
            <DeleteAssignmentButton id={a.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
