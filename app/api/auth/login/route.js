// POST /api/auth/login
// Reads email + password, checks the database, sets a cookie, returns the role.

import { NextResponse } from "next/server";
import db from "@/lib/db";
import { setSession } from "@/lib/auth";

export async function POST(request) {
  //reads data from frontend
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  // Look up user by email
  const user = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email.trim().toLowerCase());

  // compare passwords directly
  if (!user || user.password !== password) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  setSession(user.id);
  return NextResponse.json({ ok: true, role: user.role });
}
