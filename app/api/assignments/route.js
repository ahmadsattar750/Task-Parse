// POST /api/assignments
// Create a new assignment (admin only)

import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request) {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Not allowed" }, { status: 401 });
  }

  const { title, description, language, deadline, required_keywords } =
    await request.json();

  if (!title || !description || !language) {
    return NextResponse.json(
      { error: "Title, description and language are required" },
      { status: 400 }
    );
  }

  const result = db
    .prepare(
      "INSERT INTO assignments (title, description, language, deadline, required_keywords) VALUES (?, ?, ?, ?, ?)"
    )
    .run(
      title.trim(),
      description.trim(),
      language.trim(),
      deadline || null,
      (required_keywords || "").trim()
    );

  return NextResponse.json({ ok: true, id: result.lastInsertRowid });
}
