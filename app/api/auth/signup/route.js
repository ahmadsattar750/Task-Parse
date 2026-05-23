// POST /api/auth/signup
// Creates a new student account and logs them in.

import { NextResponse } from "next/server";
import db from "@/lib/db";
import { setSession } from "@/lib/auth";

export async function POST(request) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const cleanEmail = email.trim().toLowerCase();

  // Check if email already exists
  const exists = db
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(cleanEmail);
  if (exists) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 400 }
    );
  }

  // Insert student record
  const result = db
    .prepare(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'student')"
    )
    .run(name.trim(), cleanEmail, password);

  setSession(result.lastInsertRowid);
  return NextResponse.json({ ok: true });
}
