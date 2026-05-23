// DELETE /api/assignments/[id]
// Delete an assignment by id (admin only)

import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function DELETE(_request, { params }) {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Not allowed" }, { status: 401 });
  }

  db.prepare("DELETE FROM assignments WHERE id = ?").run(Number(params.id));
  return NextResponse.json({ ok: true });
}
