// Database setup for Task Parse
// We use better-sqlite3 because it is simple and synchronous (easy for beginners)
// This file:
//   1. Opens the SQLite database file
//   2. Creates tables if they do not exist
//   3. Adds one default admin and a few sample assignments on first run

import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// Make sure the "data" folder exists (SQLite file lives here)
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Create / open the database file
const db = new Database(path.join(dataDir, "taskparse.db"));

// Turn on foreign keys (needed for relations between tables)
db.pragma("foreign_keys = ON");

// ----- Create Tables -----
// users: stores both students and admins (role column tells us which one)
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// assignments: created by admin/instructor
db.exec(`
  CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    language TEXT NOT NULL,
    deadline TEXT,
    required_keywords TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// submissions: code submitted by students
db.exec(`
  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assignment_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    code TEXT NOT NULL,
    status TEXT DEFAULT 'submitted',
    submitted_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id),
    FOREIGN KEY (student_id) REFERENCES users(id)
  );
`);

// parser_logs: stores parser results for each submission
db.exec(`
  CREATE TABLE IF NOT EXISTS parser_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    submission_id INTEGER NOT NULL,
    passed INTEGER NOT NULL,
    messages TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES submissions(id)
  );
`);

// ----- Seed default admin and sample assignments (only on first run) -----
const userCount = db.prepare("SELECT COUNT(*) AS c FROM users").get().c;
if (userCount === 0) {
  // Default admin login -> email: admin@taskparse.com, password: admin123
  db.prepare(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
  ).run("Admin", "admin@taskparse.com", "admin123", "admin");

  // Add a sample student so login can be tested quickly
  db.prepare(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
  ).run("Ali Khan", "ali@student.com", "ali123", "student");
}

const assignmentCount = db
  .prepare("SELECT COUNT(*) AS c FROM assignments")
  .get().c;
if (assignmentCount === 0) {
  const insert = db.prepare(
    "INSERT INTO assignments (title, description, language, deadline, required_keywords) VALUES (?, ?, ?, ?, ?)"
  );

  insert.run(
    "Hello World in C++",
    "Write a C++ program that prints 'Hello World' using the main function and iostream library.",
    "C++",
    "2026-12-31",
    "#include,iostream,main,cout"
  );

  insert.run(
    "Python Function",
    "Write a Python program that defines a function called add(a, b) and returns the sum.",
    "Python",
    "2026-12-31",
    "def,add,return"
  );

  insert.run(
    "Simple Webpage",
    "Create a simple HTML page with a heading and a paragraph.",
    "HTML",
    "2026-12-31",
    "<html>,<body>,<h1>,<p>"
  );
}

export default db;
