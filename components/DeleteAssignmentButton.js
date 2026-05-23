"use client";
// Small client-side delete button for an assignment.

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteAssignmentButton({ id }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this assignment? Submissions will not be deleted.")) {
      return;
    }
    setBusy(true);
    const res = await fetch(`/api/assignments/${id}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) {
      router.refresh();
    } else {
      alert("Could not delete assignment.");
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={busy}
      className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:text-white hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-60"
    >
      <Trash2 size={14} />
      {busy ? "Deleting..." : "Delete"}
    </button>
  );
}
