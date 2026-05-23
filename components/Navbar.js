// Top navigation bar
// Shows different links depending on the user's role.

import Link from "next/link";
import {
  LayoutDashboard,
  History,
  ListChecks,
  PlusCircle,
  FileText,
  LogIn,
  UserPlus,
} from "lucide-react";
import Logo from "./Logo";
import LogoutButton from "./LogoutButton";

export default function Navbar({ user }) {
  return (
    <nav className="bg-white/80 backdrop-blur border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>

        <div className="flex items-center gap-5">
          {!user && (
            <>
              <Link href="/login" className="nav-link inline-flex items-center gap-1.5">
                <LogIn size={15} />
                Login
              </Link>
              <Link href="/signup" className="btn btn-primary !py-2">
                <UserPlus size={15} className="mr-1.5" />
                Sign up
              </Link>
            </>
          )}

          {user && user.role === "student" && (
            <>
              <Link
                href="/student/dashboard"
                className="nav-link inline-flex items-center gap-1.5"
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
              <Link
                href="/student/history"
                className="nav-link inline-flex items-center gap-1.5"
              >
                <History size={15} />
                My Submissions
              </Link>
              <span className="hidden md:inline-flex badge badge-blue">
                {user.name}
              </span>
              <LogoutButton />
            </>
          )}

          {user && user.role === "admin" && (
            <>
              <Link
                href="/admin/dashboard"
                className="nav-link inline-flex items-center gap-1.5"
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
              <Link
                href="/admin/assignments"
                className="nav-link inline-flex items-center gap-1.5"
              >
                <ListChecks size={15} />
                Assignments
              </Link>
              <Link
                href="/admin/assignments/new"
                className="nav-link inline-flex items-center gap-1.5"
              >
                <PlusCircle size={15} />
                Create
              </Link>
              <Link
                href="/admin/submissions"
                className="nav-link inline-flex items-center gap-1.5"
              >
                <FileText size={15} />
                Submissions
              </Link>
              <span className="hidden md:inline-flex badge badge-blue">
                Admin · {user.name}
              </span>
              <LogoutButton />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
