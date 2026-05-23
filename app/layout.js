// Root layout for the whole app
// Every page is wrapped inside this layout.
// We render a simple top navbar based on whether the user is logged in.

import "./globals.css";
import Navbar from "@/components/Navbar";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Task Parse",
  description: "Automated Code Assignment Platform",
};

export default function RootLayout({ children }) {
  // Read current user from cookie (server-side)
  const user = getCurrentUser();

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar user={user} />
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-6 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white/60">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 text-xs text-slate-500 flex items-center justify-between">
            <span>Task Parse · University Project</span>
            <span>Built with Next.js + SQLite</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
