// POST /api/submissions
// Saves the student's code as a submission AND saves the parser result
// in the parser_logs table.

import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { checkCode } from "@/lib/parser";

export async function POST(request) {
  const user = getCurrentUser();
  if (!user || user.role !== "student") {
    return NextResponse.json({ error: "Not allowed" }, { status: 401 });
  }

  const { assignmentId, code } = await request.json();
  if (!assignmentId || typeof code !== "string" || code.trim() === "") {
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

  // 1. Run parser
  const parserResult = checkCode(code, assignment);

  // 2. Save submission
  // Status will be "passed" if parser passed, otherwise "needs review"
  const status = parserResult.passed ? "passed" : "needs review";
  const subInsert = db
    .prepare(
      "INSERT INTO submissions (assignment_id, student_id, code, status) VALUES (?, ?, ?, ?)"
    )
    .run(assignment.id, user.id, code, status);

  // 3. Save parser log
  db.prepare(
    "INSERT INTO parser_logs (submission_id, passed, messages) VALUES (?, ?, ?)"
  ).run(
    subInsert.lastInsertRowid,
    parserResult.passed ? 1 : 0,
    parserResult.messages.join("\n")
  );

  return NextResponse.json({
    ok: true,
    submissionId: subInsert.lastInsertRowid,
    parser: parserResult,
  });
}
