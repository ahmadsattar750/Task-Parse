// Simple session helpers using cookies
// The "session" is just the user's id stored in an HTTP-only cookie.

import { cookies } from "next/headers";
import db from "./db";

const COOKIE_NAME = "tp_user";

// Save the user id in a cookie (called on login/signup)
export function setSession(userId) {
  cookies().set(COOKIE_NAME, String(userId), {
    httpOnly: true,
    path: "/",
    // 1 day session
    maxAge: 60 * 60 * 24,
  });
}

// Remove cookie on logout
export function clearSession() {
  cookies().delete(COOKIE_NAME);
}

// Read the cookie and load the user from the database
// Returns the user object or null if not logged in
export function getCurrentUser() {
  const cookie = cookies().get(COOKIE_NAME);
  if (!cookie) return null;

  const user = db
    .prepare("SELECT id, name, email, role FROM users WHERE id = ?")
    .get(Number(cookie.value));

  return user || null;
}
