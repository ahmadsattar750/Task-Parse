"use client";
// Simple grading form used by admin to flag/approve a submission.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, CheckCircle } from "lucide-react";

export default function GradeForm({ submissionId, currentStatus }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function save() {
    setBusy(true);
    setMsg("");

    const res = await fetch(`/api/submissions/${submissionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    setBusy(false);

    if (res.ok) {
      setMsg("Status updated.");
      router.refresh();
    } else {
      setMsg("Could not update status.");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="input max-w-xs"
      >
        <option value="submitted">submitted</option>
        <option value="passed">passed</option>
        <option value="needs review">needs review</option>
        <option value="flagged">flagged</option>
        <option value="approved">approved</option>
      </select>
      <button onClick={save} disabled={busy} className="btn btn-primary">
        <Save size={15} className="mr-1.5" />
        {busy ? "Saving..." : "Save"}
      </button>
      {msg && (
        <span className="inline-flex items-center gap-1 text-sm text-emerald-700 ml-1">
          <CheckCircle size={14} />
          {msg}
        </span>
      )}
    </div>
  );
}
