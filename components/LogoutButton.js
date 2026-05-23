"use client";
// Small client component to log the user out by calling the logout API

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-600 transition-colors"
    >
      <LogOut size={15} />
      Logout
    </button>
  );
}
