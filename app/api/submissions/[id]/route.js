// PATCH /api/submissions/[id]
// Update the status of a submission (admin only) - used for grading

import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(request, { params }) {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Not allowed" }, { status: 401 });
  }

  const { status } = await request.json();
  if (!status) {
    return NextResponse.json({ error: "Status is required" }, { status: 400 });
  }

  db.prepare("UPDATE submissions SET status = ? WHERE id = ?").run(
    status,
    Number(params.id)
  );

  return NextResponse.json({ ok: true });
}
