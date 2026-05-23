// POST /api/parser/check
// Runs the parser on the submitted code WITHOUT saving anything.
// Useful for "preview" before final submission.

import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { checkCode } from "@/lib/parser";

export async function POST(request) {
  const user = getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const { assignmentId, code } = await request.json();
  if (!assignmentId || typeof code !== "string") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const assignment = db
    .prepare("SELECT * FROM assignments WHERE id = ?")
    .get(Number(assignmentId));
  if (!assignment) {
    return NextResponse.json(
      { error: "Assignment not found" },
      { status: 404 }
    );
  }

  // Run the parser checks (logic lives in lib/parser.js)
  const result = checkCode(code, assignment);
  return NextResponse.json(result);
}
