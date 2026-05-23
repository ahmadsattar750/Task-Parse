// Home page (public landing page)
// Modern layout: hero, features, supported languages, CTA.

import Link from "next/link";
import {
  ScanSearch,
  Code2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  LogIn,
  UserPlus,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

// Each feature has a real icon (instead of the first letter)
const FEATURES = [
  {
    title: "Smart Parser",
    text: "Automatic checks for required keywords, functions and language structure before final submission.",
    Icon: ScanSearch,
  },
  {
    title: "8 Languages",
    text: "Works with C, C++, Java, Python, JavaScript, HTML, CSS and Tailwind CSS assignments.",
    Icon: Code2,
  },
  {
    title: "Instant Feedback",
    text: "Students see exactly what is missing in their code, so they can fix issues before submitting.",
    Icon: Sparkles,
  },
  {
    title: "Admin Review",
    text: "Instructors can view every submission, parser log and update the grading status in one place.",
    Icon: ShieldCheck,
  },
];

const LANGS = [
  "C",
  "C++",
  "Java",
  "Python",
  "JavaScript",
  "HTML",
  "CSS",
  "Tailwind CSS",
];

export default function HomePage() {
  const user = getCurrentUser();

  return (
    <div className="space-y-14">
      {/* HERO */}
      <section className="pt-6">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Automated code assignment{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              checking made simple
            </span>
            .
          </h1>
          <p className="mt-4 text-slate-600 text-lg leading-relaxed">
            Task Parse helps CS students submit assignments confidently. Our
            built-in parser validates required keywords, functions and basic
            structure before the final submission.
          </p>

          <div className="flex flex-wrap gap-3 mt-7">
            {!user && (
              <>
                <Link href="/signup" className="btn btn-primary">
                  <UserPlus size={16} className="mr-1.5" />
                  Get started
                  <ArrowRight size={16} className="ml-1.5" />
                </Link>
                <Link href="/login" className="btn btn-secondary">
                  <LogIn size={16} className="mr-1.5" />
                  Login
                </Link>
              </>
            )}
            {user && user.role === "student" && (
              <Link href="/student/dashboard" className="btn btn-primary">
                Go to Student Dashboard
                <ArrowRight size={16} className="ml-1.5" />
              </Link>
            )}
            {user && user.role === "admin" && (
              <Link href="/admin/dashboard" className="btn btn-primary">
                Go to Admin Dashboard
                <ArrowRight size={16} className="ml-1.5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section>
        <h2 className="section-title">What you can do</h2>
        <p className="section-sub mb-5">
          A simple workflow built for students and instructors.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card card-hover">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                  <f.Icon size={20} strokeWidth={2} />
                </span>
                <h3 className="font-semibold text-slate-800">{f.title}</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SUPPORTED LANGUAGES */}
      <section>
        <h2 className="section-title">Supported languages</h2>
        <p className="section-sub mb-5">
          Choose the right language for each assignment.
        </p>
        <div className="flex flex-wrap gap-2">
          {LANGS.map((l) => (
            <span key={l} className="badge badge-blue">
              {l}
            </span>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      {!user && (
        <section className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-800">
                Ready to submit your first assignment?
              </h3>
              <p className="text-slate-600 mt-1 text-sm">
                Create a student account in less than a minute.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/signup" className="btn btn-primary">
                <UserPlus size={16} className="mr-1.5" />
                Create account
              </Link>
              <Link href="/login" className="btn btn-secondary">
                I already have one
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
